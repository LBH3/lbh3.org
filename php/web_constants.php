<?php

$IS_HEROKU = strpos($_SERVER['SERVER_NAME'], 'heroku') !== false || strpos($_SERVER['SERVER_NAME'], 'lbh3.org') !== false;
if ($IS_HEROKU) {
  $ROOT_PATH = '/';
} else {
  $base = 'lbh3.org/';
  $php_self_exploded = explode($base, $_SERVER['PHP_SELF']);
  $ROOT_PATH = $php_self_exploded[0] . $base;
}
putenv("ROOT_PATH=$ROOT_PATH");

header('strict-transport-security: max-age=31536000; includeSubDomains');
header('Content-Security-Policy: default-src https:');
header('x-frame-options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

// some site constants that change year to year

//mismanagement info
define('gm1_name','Hairy Twatter');
define('gm1_email','reachgilbert-hash@yahoo.com');
define('gm1_phone','714-926-9844');

define('gm2_name','Lick Me Tender, Lick Me Deep');
define('gm2_email','fonsecakim@gmail.com');
define('gm2_phone','562-882-4391');

define('od1_name','Dr. Strangeglove');
define('od1_email','farooq.aamir@gmail.com');
define('od1_phone','562-424-0079');

define('od2_name','Yoko Anal');
define('od2_email','rmkons@aol.com');
define('od2_phone','805-403-2222');

define('hf1_name','Bi-Cunning-Lingual');
define('hf1_email','');
define('hf1_phone','');

define('hf2_name','Backstreet Blow Job');
define('hf2_email','');
define('hf2_phone','');

define('bm1_name','Last Train');
define('bm1_email','nordbill@hotmail.com');
define('bm1_phone','949-697-9426');

define('bm2_name','Ruv You Wong Time');
define('bm2_email','ruvyouhhh@gmail.com');
define('bm2_phone','714-412-1571');

define('mm1_name','Super Soaker');
define('mm1_email','');
define('mm1_phone','');

define('mm2_name', 'Top Cum');
define('mm2_email','hariette_tc@yahoo.com');
define('mm2_phone','714-222-1083');

define('hc1_name','Hi Speed Copulator');
define('hc1_email','gaber.family@verizon.net');
define('hc1_phone','562-822-8400');

define('hc2_name','Camel Toe Ho');
define('hc2_email','touchmegod@yahoo.com');
define('hc2_phone','310-941-4011');

define('tm1_name','Hokey Tokey');
define('tm1_email','santoschris92@gmail.com');
define('tm1_phone','323-742-5086');

define('tm2_name','Victoria’s Secretion');
define('tm2_email','vic.lbh3@gmail.com');
define('tm2_phone','562-999-4842');

define('os1_name','Broomhilda');
define('os1_email','broomh3@aol.com');
define('os1_phone','562-423-6149');

define('os2_name','Transcuntinental');
define('os2_email','transc.ntinental@gmail.com');
define('os2_phone','562-818-5612');

define('wbm_name', 'I’m Fucking Matt Damon');
define('wbm_email','ifmd@chasenlehara.com');
define('wbm_phone',' 562-533-2821');

define('hh_name', 'Alouette');
define('hh_email','alouette.lbh3@yahoo.com');
define('hh_phone','714-526-7823');

define('hb1_name', 'Pinhole Artist');
define('hb1_email','carolynamour@yahoo.com');
define('hb1_phone','310-863-5347');

define('hb2_name', 'Spitty Spitty Gang Bang');
define('hb2_email','nicrosin@outlook.com');
define('hb2_phone','310-776-2500');
?>
