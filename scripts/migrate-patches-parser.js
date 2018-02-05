// From https://gist.github.com/andrei-m/982927#gistcomment-2326555
const levenshtein = (a,b)=>{
  let alen = a.length;
  let blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;
  let tmp, i, j, prev, val, row, ma, mb, mc, md, bprev;

  if (alen> blen) {
    tmp = a;
    a = b;
    b = tmp;
  }

  row = new Int8Array(alen+1);
  // init the row
  for (i = 0; i <= alen; i++) {
    row[i] = i;
  }

  // fill in the rest
  for (i = 1; i <= blen; i++) {
    prev = i;
    bprev = b[i - 1]
    for (j = 1; j <= alen; j++) {
      if (bprev === a[j - 1]) {
        val = row[j-1];
      } else {
          ma = prev+1;
          mb = row[j]+1;
          mc = ma - ((ma - mb) & ((mb - ma) >> 7));
          md = row[j-1]+1;
          val = mc - ((mc - md) & ((md - mc) >> 7));
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[alen] = prev;
  }
  return row[alen];
};

const levenshteinResult = function(name, hashers) {
    return hashers.reduce((previous, current) => {
      if (!previous.levenshtein) {
        const previousHashName = previous.hash_name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
        previous.levenshtein = levenshtein(name, previousHashName);
      }
      const currentHashName = current.hash_name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
      current.levenshtein = currentHashName ? levenshtein(name, currentHashName) : Infinity;
      if (previous && previous.levenshtein < current.levenshtein) {
        return previous;
      } else {
        return current;
      }
    });
};

const splitOnLast = function(string, separator) {
  const lastIndex = string.lastIndexOf(separator);
  return lastIndex > -1 ? [
    string.slice(0, lastIndex),
    string.slice(lastIndex + 1)
  ] : [string];
};

module.exports = function(client) {
  const firstQuery = function(name, number, trailNumber, type) {
    console.info('firstQuery:', name, number, trailNumber, type);
    name = name.replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g, "").toLowerCase();
    return new Promise((resolve, reject) => {
      const query = `SELECT eh1.hasher_id,eh1.hash_name,eh1.role,eh2.hare_count,eh3.run_count
	FROM events_hashers as eh1
	LEFT JOIN (
		SELECT eh2.hasher_id,COUNT(*) as hare_count FROM events_hashers as eh2 WHERE role ILIKE '%hare%' GROUP BY hasher_id
	) eh2 ON eh2.hasher_id = eh1.hasher_id
	JOIN (
		SELECT eh3.hasher_id,COUNT(*) as run_count FROM events_hashers as eh3 GROUP BY hasher_id
	) eh3 ON eh3.hasher_id = eh1.hasher_id
	WHERE trail_number = ${trailNumber};`;
      client.query(query, (error, response) => {
        if (error) {
          debugger;
          reject(error);
        } else {
          const nameSplit = name.split(' ');
          let filtered = response.rows;
          if (type === 'hare') {
            const meetsHareCountMinimum = response.rows.filter(row => {
              return row.hare_count >= number;
            });
            if (meetsHareCountMinimum.length > 0) {
              filtered = meetsHareCountMinimum;
            }
          } else if (type === 'run') {
            const meetsRunCountMinimum = response.rows.filter(row => {
              return row.run_count >= number;
            });
            if (meetsRunCountMinimum.length > 0) {
              filtered = meetsRunCountMinimum;
            }
          }
          const filteredByName = filtered.filter(row => {
            const hashName = row.hash_name.toLowerCase();
            if (nameSplit[1]) {
              return hashName.includes(nameSplit[0]) && hashName.includes(nameSplit[1]);
            } else {
              return hashName.includes(nameSplit[0]);
            }
          });
          filtered = (filteredByName.length === 0) ? filtered : filteredByName;
          if (filtered.length === 1) {
            resolve(filtered[0] && filtered[0].hasher_id);
          } else {
            const result = levenshteinResult(name, filtered);
            if (result.levenshtein < 6) {
              resolve(result && result.hasher_id);
            } else {
              console.info(`Rejecting result for “${name}” due to ${result.levenshtein} levenshtein:`, result);
              resolve();
            }
          }
        }
      });
    });
  };

  const secondQuery = function(name) {
    console.info('secondQuery:', name);
    return new Promise((resolve, reject) => {
      const query = `SELECT hash_name,id FROM hashers WHERE hash_name ILIKE '${name.replace(/[']/g, '%')}%'`;
      client.query(query, (error, response) => {
        if (error) {
          debugger;
          reject(error);
        } else {
          const firstRow = response.rows[0];
          resolve(firstRow && firstRow.id);
        }
      });
    });
  };

  const thirdQuery = function(name) {
    console.info('thirdQuery:', name);
    name = name.toLowerCase();
    let nameSplit = name.split(' ');
    nameSplit = (nameSplit.length > 1) ? nameSplit : [name.slice(0, 2)];
    const nameQueries = nameSplit.map(part => {
      return `hash_name ILIKE '%${part.replace(/[']/g, '%')}%'`;
    });
    return new Promise((resolve, reject) => {
      const query = `SELECT hash_name,id FROM hashers WHERE ${nameQueries.join(' OR ')}`;
      client.query(query, (error, response) => {
        if (error) {
          debugger;
          reject(error);
        } else {
          if (response.rowCount === 1) {
            const firstRow = response.rows[0];
            resolve(firstRow && firstRow.id);
          } else {
            let filtered = response.rows.filter(row => {
              const hashName = row.hash_name.toLowerCase();
              return hashName.includes(nameSplit[0]) && hashName.includes(nameSplit[1]);
            });
            filtered = (filtered.length === 0) ? response.rows : filtered;
            if (filtered.length === 1) {
              resolve(filtered[0].id);
            } else if (filtered.length > 1) {
              const result = levenshteinResult(name, filtered);
              resolve(result && result.id);
            } else {
              resolve();
            }
          }
        }
      });
    });
  };

  return function(string, trail_number, type) {
    // Try splitting by semicolons first
    let groups = string.split(';');
    // Next try splitting by newlines
    groups = (groups.length > 1) ? groups : string.split('\n');
    // Next try splitting by commas, but only if it looks like there are multiple
    if (groups.length === 1) {
      const equalMatches = string.match(/=/g);
      if (equalMatches && equalMatches.length > 1) {
        groups = string.split(',');
      }
    }
    const promises = [];
    groups.forEach(group => {
      group = group.trim();
      let parts = splitOnLast(group, '=');
      parts = (parts.length > 1) ? parts : splitOnLast(group, '-');
      parts = (parts.length > 1) ? parts : splitOnLast(group, ' ');
      const leftSide = parts[0];
      const leftSideSplit = (leftSide.indexOf('&') > 5) ? leftSide.split('&') : [leftSide];
      leftSideSplit.forEach(function(name) {
        name = name.trim();
        let rightSideString = parts[1];
        if (!rightSideString) {
          const numberMatch = name.replace(/,/g, '').match(/\d+/);
          if (numberMatch && numberMatch[0]) {
            name = name.slice(0, name.indexOf(numberMatch[0]));
            rightSideString = numberMatch[0];
          }
        }
        rightSideString = rightSideString || '';
        rightSideString.split('&').forEach(function(numberString) {
          const numberMatch = (numberString) ? numberString.replace(/,/g, '').match(/\d+/) : null;
          if (numberMatch) {
            const number = Number(numberMatch[0]);
            promises.push(firstQuery(name, number, trail_number, type).then(hasher_id => {
              if (hasher_id) {
                return {hasher_id, number, trail_number, type};
              } else {
                return secondQuery(name, number, trail_number, type).then(hasher_id => {
                  if (hasher_id) {
                    return {hasher_id, number, trail_number, type};
                  } else {
                    return thirdQuery(name).then(hasher_id => {
                      if (hasher_id) {
                        return {hasher_id, number, trail_number, type};
                      }
                    });
                  }
                });
              }
            }));
          }
        });
      });
    });
    return Promise.all(promises).then(results => {
      const dupes = {};
      return results.filter(patch => {
        if (patch) {
          type = type || '';
          const key = patch.hasher_id.toString() + type.toString() + patch.number.toString();
          if (!dupes[key]) {
            dupes[key] = true;
            return patch;
          }
        }
      });
    }, error => {
      debugger;
      console.error(error);
    });
  };
};
