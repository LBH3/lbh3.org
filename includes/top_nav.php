<?php
$index_active = "";
$past_active = "";
$hareline_active = "";
$about_active = "";
$script = $_SERVER['SCRIPT_NAME'];
if (strpos($script, 'index') != false) {
	$index_active = 'active';
} else if (strpos($script, 'pastruns') != false) {
	$past_active = 'active';
} else if (strpos($script, 'hareline') != false) {
	$hareline_active = 'active';
} else if (strpos($script, 'about') != false) {
	$about_active = 'active';
}
?>
<nav>
	<ul class="container nav">
		<li class="<?php echo $index_active; ?> nav-item">
			<a class="nav-link" href="<?php echo getenv('ROOT_PATH'); ?>index.php">Home</a>
		</li>
		<li class="<?php echo $hareline_active; ?> nav-item">
			<a class="nav-link" href="<?php echo getenv('ROOT_PATH'); ?>hareline/hareline.php">Hareline</a>
		</li>
		<li class="<?php echo $past_active; ?> nav-item">
			<a class="nav-link" href="<?php echo getenv('ROOT_PATH'); ?>pastruns/pasthash.php">Past Runs</a>
		</li>
		<li class="<?php echo $about_active; ?> nav-item">
			<a class="nav-link" href="<?php echo getenv('ROOT_PATH'); ?>about/aboutus.php">About</a>
		</li>
	</ul>
</nav>
