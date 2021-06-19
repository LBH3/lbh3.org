import QUnit from 'qunitjs';
import { Address, Hasher } from './hasher';

QUnit.module('models/hasher');

QUnit.test('getList', function(assert) {
  const done = assert.async();
  Hasher.getList().then(function(items) {
    assert.equal(items.length, 2);
    assert.equal(items.item(0).description, 'First item');
    done();
  });
});

QUnit.test('Address.fromPlace in the USA', function(assert) {
  const place = JSON.parse(`{"id":"e908d10310c7f20c5da5e71eb2d81e290b58fbe3","addressComponents":[{"long_name":"# 200","short_name":"# 200","types":["subpremise"]},{"long_name":"9604","short_name":"9604","types":["street_number"]},{"long_name":"Artesia Boulevard","short_name":"Artesia Blvd","types":["route"]},{"long_name":"Bellflower","short_name":"Bellflower","types":["locality","political"]},{"long_name":"Los Angeles County","short_name":"Los Angeles County","types":["administrative_area_level_2","political"]},{"long_name":"California","short_name":"CA","types":["administrative_area_level_1","political"]},{"long_name":"United States","short_name":"US","types":["country","political"]},{"long_name":"90706","short_name":"90706","types":["postal_code"]},{"long_name":"8044","short_name":"8044","types":["postal_code_suffix"]}],"formattedAddress":"9604 Artesia Blvd # 200, Bellflower, CA 90706, USA","formattedPhoneNumber":"(562) 925-8892","geometryLocation":{"type":"Point","coordinates":[33.8745692,-118.12883920000002]},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png","internationalPhoneNumber":"+1 562-925-8892","name":"Dr. Glenn T. Hifumi, MD","placeId":"ChIJEXawPbwy3YAR-7VImyauvpo","reference":"ChIJEXawPbwy3YAR-7VImyauvpo","scope":"GOOGLE","types":["doctor","health","point_of_interest","establishment"],"url":"https://maps.google.com/?cid=11150541208253150715","vicinity":"9604 Artesia Boulevard # 200, Bellflower","website":null,"geometryViewport":{"type":"Polygon","coordinates":[[[33.87601523029149,-118.12749036970848],[33.87331726970849,-118.1301883302915]]]},"createdAt":"2019-09-14T19:22:49.588Z","updatedAt":"2019-09-15T21:19:29.718Z","created_at":"2019-09-14T19:22:49.588Z","updated_at":"2019-09-15T21:19:29.718Z"}`);
  const address = Address.fromPlace(place);
  assert.equal(address.city, 'Bellflower');
  assert.equal(address.country, 'United States');
  assert.equal(address.formattedAddress, '9604 Artesia Blvd # 200, Bellflower, CA 90706, United States');
  assert.equal(address.googlePlaceId, 'e908d10310c7f20c5da5e71eb2d81e290b58fbe3');
  assert.equal(address.state, 'CA');
  assert.equal(address.street, '9604 Artesia Blvd');
  assert.equal(address.subpremise, '# 200');
  assert.equal(address.zip, '90706');
});

QUnit.test('Address.fromPlace for a city in the USA', function(assert) {
  const place = JSON.parse(`{"id":"71b374acb987b8be875a091969db9d11158f8712","addressComponents":[{"long_name":"Long Beach","short_name":"Long Beach","types":["locality","political"]},{"long_name":"Los Angeles County","short_name":"Los Angeles County","types":["administrative_area_level_2","political"]},{"long_name":"California","short_name":"CA","types":["administrative_area_level_1","political"]},{"long_name":"United States","short_name":"US","types":["country","political"]}],"formattedAddress":"Long Beach, CA, USA","formattedPhoneNumber":null,"geometryLocation":{"type":"Point","coordinates":[33.7700504,-118.1937395]},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png","internationalPhoneNumber":null,"name":"Long Beach","placeId":"ChIJWdeZQOjKwoARqo8qxPo6AKE","reference":"ChIJWdeZQOjKwoARqo8qxPo6AKE","scope":"GOOGLE","types":["locality","political"],"url":"https://maps.google.com/?q=Long+Beach,+CA,+USA&ftid=0x80c2cae84099d759:0xa1003afac42a8faa","vicinity":"Long Beach","website":"http://www.ci.long-beach.ca.us/","geometryViewport":{"type":"Polygon","coordinates":[[[33.8854591,-118.063253],[33.714957,-118.248966]]]},"createdAt":"2017-10-30T14:21:41.295Z","updatedAt":"2020-01-26T09:13:45.078Z","created_at":"2017-10-30T14:21:41.295Z","updated_at":"2020-01-26T09:13:45.078Z"}`);
  const address = Address.fromPlace(place);
  assert.equal(address.city, 'Long Beach');
  assert.equal(address.country, 'United States');
  assert.equal(address.formattedAddress, 'Long Beach, CA, USA');
  assert.equal(address.googlePlaceId, '71b374acb987b8be875a091969db9d11158f8712');
  assert.equal(address.state, 'CA');
  assert.equal(address.street, null);
  assert.equal(address.subpremise, undefined);
  assert.equal(address.zip, undefined);
});

QUnit.test('Address.fromPlace in Spain', function(assert) {
  const place = JSON.parse(`{"id":"7ff0db371bce51f482ba411485edbc3c104d6ba6","addressComponents":[{"long_name":"27","short_name":"27","types":["street_number"]},{"long_name":"Calle Luis Morote","short_name":"Calle Luis Morote","types":["route"]},{"long_name":"Las Palmas de Gran Canaria","short_name":"Las Palmas de Gran Canaria","types":["locality","political"]},{"long_name":"Las Palmas","short_name":"Las Palmas","types":["administrative_area_level_2","political"]},{"long_name":"Canarias","short_name":"CN","types":["administrative_area_level_1","political"]},{"long_name":"Spain","short_name":"ES","types":["country","political"]},{"long_name":"35007","short_name":"35007","types":["postal_code"]}],"formattedAddress":"Calle Luis Morote, 27, 35007 Las Palmas de Gran Canaria, Las Palmas, Spain","formattedPhoneNumber":null,"geometryLocation":{"type":"Point","coordinates":[28.1411467,-15.432766799999968]},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png","internationalPhoneNumber":null,"name":"Calle Luis Morote, 27","placeId":"ChIJBdpkrj-VQAwRBWCcTx9qToU","reference":"ChIJBdpkrj-VQAwRBWCcTx9qToU","scope":"GOOGLE","types":["premise"],"url":"https://maps.google.com/?q=Calle+Luis+Morote,+27,+35007+Las+Palmas+de+Gran+Canaria,+Las+Palmas,+Spain&ftid=0xc40953fae64da05:0x854e6a1f4f9c6005","vicinity":"Las Palmas de Gran Canaria","website":null,"geometryViewport":{"type":"Polygon","coordinates":[[[28.1425799802915,-15.431344969708562],[28.1398820197085,-15.434042930291525]]]},"createdAt":"2019-09-15T21:06:46.743Z","updatedAt":"2019-09-15T21:25:01.123Z","created_at":"2019-09-15T21:06:46.743Z","updated_at":"2019-09-15T21:25:01.123Z"}`);
  const address = Address.fromPlace(place);
  assert.equal(address.city, 'Las Palmas de Gran Canaria');
  assert.equal(address.country, 'Spain');
  assert.equal(address.formattedAddress, 'Calle Luis Morote, 27, 35007 Las Palmas de Gran Canaria, Las Palmas, Spain');
  assert.equal(address.googlePlaceId, '7ff0db371bce51f482ba411485edbc3c104d6ba6');
  assert.equal(address.state, 'CN');
  assert.equal(address.street, 'Calle Luis Morote, 27');
  assert.equal(address.subpremise, undefined);
  assert.equal(address.zip, '35007');
});

QUnit.test('Address.fromPlace in Ashton-under-Lyne', function(assert) {
  const place = JSON.parse(`{"id":"25acc5db10db4e984ba40092d3bcfbe2de9d8611","addressComponents":[{"long_name":"90","short_name":"90","types":["street_number"]},{"long_name":"Pelham Street","short_name":"Pelham St","types":["route"]},{"long_name":"Ashton-under-Lyne","short_name":"Ashton-under-Lyne","types":["postal_town"]},{"long_name":"Greater Manchester","short_name":"Greater Manchester","types":["administrative_area_level_2","political"]},{"long_name":"England","short_name":"England","types":["administrative_area_level_1","political"]},{"long_name":"United Kingdom","short_name":"GB","types":["country","political"]},{"long_name":"OL7 0DU","short_name":"OL7 0DU","types":["postal_code"]}],"formattedAddress":"90 Pelham St, Ashton-under-Lyne OL7 0DU, UK","formattedPhoneNumber":null,"geometryLocation":{"type":"Point","coordinates":[53.4779552,-2.1170164000000113]},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png","internationalPhoneNumber":null,"name":"90 Pelham St","placeId":"ChIJcTAoHY22e0gRvDc9G8rvR7s","reference":"ChIJcTAoHY22e0gRvDc9G8rvR7s","scope":"GOOGLE","types":["premise"],"url":"https://maps.google.com/?q=90+Pelham+St,+Ashton-under-Lyne+OL7+0DU,+UK&ftid=0x487bb68d1d283071:0xbb47efca1b3d37bc","vicinity":null,"website":null,"geometryViewport":{"type":"Polygon","coordinates":[[[53.4792592802915,-2.115580569708527],[53.4765613197085,-2.118278530291491]]]},"createdAt":"2019-09-15T21:47:41.502Z","updatedAt":"2019-09-15T21:49:20.860Z","created_at":"2019-09-15T21:47:41.502Z","updated_at":"2019-09-15T21:49:20.860Z"}`);
  const address = Address.fromPlace(place);
  assert.equal(address.city, 'Ashton-under-Lyne');
  assert.equal(address.country, 'United Kingdom');
  assert.equal(address.formattedAddress, '90 Pelham St, Ashton-under-Lyne OL7 0DU, UK');
  assert.equal(address.googlePlaceId, '25acc5db10db4e984ba40092d3bcfbe2de9d8611');
  assert.equal(address.state, 'Greater Manchester, England');
  assert.equal(address.street, '90 Pelham St');
  assert.equal(address.subpremise, undefined);
  assert.equal(address.zip, 'OL7 0DU');
});

QUnit.test('Address.fromPlace in Abingdon', function(assert) {
  const place = JSON.parse(`{"id":"37754d72331b0610738c25f1895646193a4a10db","addressComponents":[{"long_name":"21","short_name":"21","types":["street_number"]},{"long_name":"Trenchard Avenue","short_name":"Trenchard Ave","types":["route"]},{"long_name":"Milton","short_name":"Milton","types":["locality","political"]},{"long_name":"Abingdon","short_name":"Abingdon","types":["postal_town"]},{"long_name":"Oxfordshire","short_name":"Oxfordshire","types":["administrative_area_level_2","political"]},{"long_name":"England","short_name":"England","types":["administrative_area_level_1","political"]},{"long_name":"United Kingdom","short_name":"GB","types":["country","political"]},{"long_name":"OX14 4DS","short_name":"OX14 4DS","types":["postal_code"]}],"formattedAddress":"21 Trenchard Ave, Milton, Abingdon OX14 4DS, UK","formattedPhoneNumber":null,"geometryLocation":{"type":"Point","coordinates":[51.6170372,-1.3027951000000257]},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png","internationalPhoneNumber":null,"name":"21 Trenchard Ave","placeId":"ChIJJctBjby5dkgRmQ58Zh85MJc","reference":"ChIJJctBjby5dkgRmQ58Zh85MJc","scope":"GOOGLE","types":["street_address"],"url":"https://maps.google.com/?q=21+Trenchard+Ave,+Milton,+Abingdon+OX14+4DS,+UK&ftid=0x4876b9bc8d41cb25:0x9730391f667c0e99","vicinity":"Milton","website":null,"geometryViewport":{"type":"Polygon","coordinates":[[[51.6183601302915,-1.3014895697085649],[51.6156621697085,-1.3041875302915287]]]},"createdAt":"2019-09-16T07:14:51.966Z","updatedAt":"2019-09-16T07:26:55.345Z","created_at":"2019-09-16T07:14:51.966Z","updated_at":"2019-09-16T07:26:55.345Z"}`);
  const address = Address.fromPlace(place);
  assert.equal(address.city, 'Abingdon');
  assert.equal(address.country, 'United Kingdom');
  assert.equal(address.formattedAddress, '21 Trenchard Ave, Milton, Abingdon OX14 4DS, UK');
  assert.equal(address.googlePlaceId, '37754d72331b0610738c25f1895646193a4a10db');
  assert.equal(address.state, 'Oxfordshire, England');
  assert.equal(address.street, '21 Trenchard Ave');
  assert.equal(address.subpremise, undefined);
  assert.equal(address.zip, 'OX14 4DS');
});

QUnit.test('Address.fromPlace in Brazil', function(assert) {
  const place = JSON.parse(`{"id":"549f79f79e2f68662ee33d8a270dab9f9517d893","addressComponents":[{"long_name":"801","short_name":"801","types":["street_number"]},{"long_name":"Avenida Beira Mar","short_name":"Av. Beira Mar","types":["route"]},{"long_name":"Praia de Iracema","short_name":"Praia de Iracema","types":["sublocality_level_1","sublocality","political"]},{"long_name":"Fortaleza","short_name":"Fortaleza","types":["administrative_area_level_2","political"]},{"long_name":"Ceará","short_name":"CE","types":["administrative_area_level_1","political"]},{"long_name":"Brazil","short_name":"BR","types":["country","political"]},{"long_name":"60060-610","short_name":"60060-610","types":["postal_code"]}],"formattedAddress":"Av. Beira Mar, 801 - Praia de Iracema, Fortaleza - CE, 60060-610, Brazil","formattedPhoneNumber":"","geometryLocation":{"type":"Point","coordinates":[-3.7195655,-38.513087900000016]},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png","internationalPhoneNumber":"","name":"Av. Beira Mar, 801","placeId":"ChIJVcRAE0dIxwcRZ8e2ZQTrzwc","reference":"ChIJVcRAE0dIxwcRZ8e2ZQTrzwc","scope":"GOOGLE","types":["street_address"],"url":"https://maps.google.com/?q=Av.+Beira+Mar,+801+-+Praia+de+Iracema,+Fortaleza+-+CE,+60060-610,+Brazil&ftid=0x7c748471340c455:0x7cfeb0465b6c767","vicinity":"Praia de Iracema","website":"","geometryViewport":{"type":"Polygon","coordinates":[[[-3.718242619708498,-38.51176281970851],[-3.720940580291502,-38.51446078029153]]]},"createdAt":"2019-09-16T08:25:23.977Z","updatedAt":"2019-09-16T08:25:23.990Z","created_at":"2019-09-16T08:25:23.977Z","updated_at":"2019-09-16T08:25:23.990Z"}`);
  const address = Address.fromPlace(place);
  assert.equal(address.city, 'Fortaleza');
  assert.equal(address.country, 'Brazil');
  assert.equal(address.formattedAddress, 'Av. Beira Mar, 801 - Praia de Iracema, Fortaleza - CE, 60060-610, Brazil');
  assert.equal(address.googlePlaceId, '549f79f79e2f68662ee33d8a270dab9f9517d893');
  assert.equal(address.state, 'CE');
  assert.equal(address.street, 'Av. Beira Mar, 801');
  assert.equal(address.subpremise, undefined);
  assert.equal(address.zip, '60060-610');
});

QUnit.test('Address.fromPlace in China', function(assert) {
  const place = JSON.parse(`{"id":"496e97884828982538530c551b98bf90a33b4d21","addressComponents":[{"long_name":"15","short_name":"15","types":["street_number"]},{"long_name":"Sau Wa Fong","short_name":"Sau Wa Fong","types":["route"]},{"long_name":"Wan Chai","short_name":"Wan Chai","types":["neighborhood","political"]},{"long_name":"Hong Kong Island","short_name":"Hong Kong Island","types":["administrative_area_level_1","political"]},{"long_name":"Hong Kong","short_name":"HK","types":["country","political"]}],"formattedAddress":"15 Sau Wa Fong, Wan Chai, Hong Kong","formattedPhoneNumber":"","geometryLocation":{"type":"Point","coordinates":[22.2758549,114.1695449]},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png","internationalPhoneNumber":"","name":"15 Sau Wa Fong","placeId":"EiMxNSBTYXUgV2EgRm9uZywgV2FuIENoYWksIEhvbmcgS29uZyIwEi4KFAoSCXlCQDRdAAQ0EXRQ9Pl0V4uaEA8qFAoSCcNrrDZdAAQ0EYtjebk9YodP","reference":"EiMxNSBTYXUgV2EgRm9uZywgV2FuIENoYWksIEhvbmcgS29uZyIwEi4KFAoSCXlCQDRdAAQ0EXRQ9Pl0V4uaEA8qFAoSCcNrrDZdAAQ0EYtjebk9YodP","scope":"GOOGLE","types":["street_address"],"url":"https://maps.google.com/?q=15+Sau+Wa+Fong,+Wan+Chai,+Hong+Kong&ftid=0x3404005d34404279:0xf8cbc8cd13f3480b","vicinity":"","website":"","geometryViewport":{"type":"Polygon","coordinates":[[[22.2771637802915,114.17086028029144],[22.2744658197085,114.16816231970847]]]},"createdAt":"2019-09-16T08:18:44.104Z","updatedAt":"2019-09-16T08:18:44.117Z","created_at":"2019-09-16T08:18:44.104Z","updated_at":"2019-09-16T08:18:44.117Z"}`);
  const address = Address.fromPlace(place);
  assert.equal(address.city, 'Wan Chai');
  assert.equal(address.country, 'Hong Kong');
  assert.equal(address.formattedAddress, '15 Sau Wa Fong, Wan Chai, Hong Kong');
  assert.equal(address.googlePlaceId, '496e97884828982538530c551b98bf90a33b4d21');
  assert.equal(address.state, 'Hong Kong Island');
  assert.equal(address.street, '15 Sau Wa Fong');
  assert.equal(address.subpremise, undefined);
  assert.equal(address.zip, undefined);
});

QUnit.test('Address formattedAddress with a unit letter', function(assert) {
  const place = JSON.parse(`{"city":"Long Beach","country":"United States","formattedAddress":"1234 La Verne Ave Unit C, Long Beach, CA, 90803, United States","privacy":"bored","state":"CA","street":"1234 La Verne Ave","subpremise":"C","zip":"90803"}`);
  const address = new Address(place);
  assert.equal(address.city, 'Long Beach');
  assert.equal(address.country, 'United States');
  assert.equal(address.formattedAddress, '1234 La Verne Ave Unit C, Long Beach, CA 90803, United States');
  assert.equal(address.state, 'CA');
  assert.equal(address.street, '1234 La Verne Ave');
  assert.equal(address.subpremise, 'C');
  assert.equal(address.zip, '90803');
});

QUnit.test('Address formattedAddress with a unit number', function(assert) {
  const place = JSON.parse(`{"city":"Long Beach","country":"United States","formattedAddress":"4321 Nieto Ave #4, Long Beach, CA, 90803, United States","privacy":"bored","state":"CA","street":"4321 Nieto Ave","subpremise":"#4","zip":"90803"}`);
  const address = new Address(place);
  assert.equal(address.city, 'Long Beach');
  assert.equal(address.country, 'United States');
  assert.equal(address.formattedAddress, '4321 Nieto Ave #4, Long Beach, CA 90803, United States');
  assert.equal(address.state, 'CA');
  assert.equal(address.street, '4321 Nieto Ave');
  assert.equal(address.subpremise, '#4');
  assert.equal(address.zip, '90803');
});
