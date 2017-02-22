<?php
$index_selected = "";
$past_selected = "";
$mismanage_selected = "";
$hareline_selected = "";
$about_selected = "";
$script = $_SERVER['SCRIPT_NAME'];
if (strpos($script, 'index') != false) {
	$index_selected = ' class="selected"';
} else if (strpos($script, 'pastruns') != false) {
	$past_selected = ' class="selected"';
} else if (strpos($script, 'pics') != false) {
	$past_selected = ' class="selected"';
} else if (strpos($script, 'snooze') != false) {
	$past_selected = ' class="selected"';
} else if (strpos($script, 'mismanage') != false) {
	$mismanage_selected = ' class="selected"';
} else if (strpos($script, 'hareline') != false) {
	$hareline_selected = ' class="selected"';
} else if (strpos($script, 'about') != false) {
	$about_selected = ' class="selected"';
}
?>
		<div id="nav">
			<ul>
				<li<?php echo $index_selected; ?>><a href="<?php echo getenv('ROOT_PATH'); ?>index.php">Home</a></li>
				<li<?php echo $past_selected; ?>><a href="<?php echo getenv('ROOT_PATH'); ?>pastruns/pasthash.php">Past Runs</a></li>
				<li<?php echo $mismanage_selected; ?>><a href="<?php echo getenv('ROOT_PATH'); ?>mismanage/mismanage.php">Mismanagement</a></li>
				<li<?php echo $hareline_selected; ?>><a href="<?php echo getenv('ROOT_PATH'); ?>hareline/hareline.php">Hareline</a></li>
				<li<?php echo $about_selected; ?>><a href="<?php echo getenv('ROOT_PATH'); ?>about/aboutus.php">About LBH3</a></li>
				<li><a href="http://www.hash.org/">So Cal Hash Calendar</a></li>
			</ul>
		</div>
