<?php
$word = $_REQUEST['word'];
$max_num = $_REQUEST['max_num'];
// query data by word and max num
$data = array("hello", 'world', '...', $word, );
echo json_encode($data);
