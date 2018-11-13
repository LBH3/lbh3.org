import fixture from 'can-fixture';
import Ballot from '../ballot';

const data = [
  {
    id: 1,
    electionId: 1,
    encrypted: 'PH0bn1j1Vdiojw0Hp9i61MrpLQA2n0xpLf1zKgRmjPHRvZ+sVqI2XT761k/rChOem1zqb648r4zYFH/msR155HzCv6tolpqZgSiF/zg2JC3Ph7UxxWGaR7yXaR62jECcnlrGIk1ZtpwV7a32jqGS7pK9dRWKeYJ4xmwJp4P/FH3VB856ovvfnVYGUT8bWqv0YXaMFpV5J9K9shvZJfQFDu84l02rtaE2rAfHwXPxGQrVzYg7C7qxj6IoDEZjMvoALLjsWEE3fFxSstJcixWHZbNAmGq1m3JmSSpwDKoyRaqXAklDK5XVG3Y49fyBWljPag4imPI+36GL3MJ/YMZrtGKnj6qqa/ln+C5IOxemF1z0V8Pse3ywGDLvTmst60IvoZ8YbCd6fh6/89pI5vNMbYnq+kcEsg8KJe0tLwqGGzmVP92VN+MkMdKEhznN92/1ANwH03+YpNfwlixoLwI6Nkb0GxzMhKyGCHVGijv9iAwnl8ZoeBid2IZ2qxsY/UlChYkNJvhJWciReX/EDTJUdY7fil4nyLUOt6wkJLIMLKuSneJrfi2LxEqgYMiewfKaZHJwy99rsEdFPWynHBXnwc3WQriZo4Lun84M7AhMOwkOi1LOdxoSuzGV2kA7UAavB7EVLgVqoiFNT4GcYcmEgJ2SdjT+qXz9H5XmWAjnBaU='
  }
];

fixture('GET /api/ballots', {
  total: data.length,
  limit: 100,
  skip: 0,
  data
});

fixture('POST /api/ballots', (request, response) => {
  response(201, {
    id: Math.random(),
    ...request.data
  });
});
