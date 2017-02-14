<?php
	require "../php/web_constants.php";
?>
<!DOCTYPE html>
<html>
	<?php include '../includes/html_head.php'; ?>
<body>
<div id="wrapper">
	<?php include '../includes/header.html'; ?>
	<?php include '../includes/top_nav.php'; ?>
	<div class="clear"></div>
	<?php include '../includes/news.html'; ?>
	<div id="content">
		<h2>Buster's Secret Page</h2>
		<img class="unicorn" src="../images/unicorn.gif">
	</div>
	<div class="clear"></div>	
</div>	
	<div id="footer"><span class="wbm">For website issues, contact <a href="mailto: <?php echo wbm_email;?>"><?php echo wbm_name;?></a></span><span class="lastupdate">Last Update: January 14, 2015</a></div>
</body>
</html>