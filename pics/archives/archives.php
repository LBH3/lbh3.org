<?php
	require "../../php/web_constants.php";
?>
<!DOCTYPE html>
<html>
	<?php include '../../includes/html_head.php'; ?>
<body>
<div id="wrapper">
	<?php include '../../includes/header.html'; ?>
	<?php include '../../includes/top_nav.php'; ?>
	<div class="clear"></div>
	<?php include '../../includes/news.html'; ?>
	<div id="content">
		<h2>Photo Archive Pages</h2>
		<div id="archive_links">
			<a href="pics2014.php">2014 Photos</a>
			<a href="pics2013.php">2013 Photos</a>
		</div>
	</div>
	<div class="clear"></div>	
</div>	
	<div id="footer"><span class="wbm">For website issues, contact <a href="mailto: <?php echo wbm_email;?>"><?php echo wbm_name;?></a></span><span class="lastupdate">Last Update: February 12, 2016</a></div>
</body>
</html>