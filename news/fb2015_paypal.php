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
		<h2>Found'er Balls 2015</h2>
		<h3>Pay with PayPal</h3>
		<p>Enter your information below and click Add to Cart to be taken to the PayPal site to complete your payment.</p>
		<p>Please note, you will be charged an additional $1.50 in fees.</p>
		<form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
		<input type="hidden" name="cmd" value="_s-xclick">
		<input type="hidden" name="hosted_button_id" value="ETJFX69AE6T9J">
		<table>
		<tr><td><input type="hidden" name="on0" value="Hash Name">Hash Name</td></tr><tr><td><input type="text" name="os0" maxlength="200"></td></tr>
		<tr><td><input type="hidden" name="on1" value="Veggie?">Veggie?</td></tr><tr><td><input type="text" name="os1" maxlength="200"></td></tr>
		</table>
		<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_cart_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
		<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
		</form>
	</div>
	<div class="clear"></div>	
</div>	
	<div id="footer"><span class="wbm">For website issues, contact <a href="mailto: <?php echo wbm_email;?>"><?php echo wbm_name;?></a></span><span class="lastupdate">Last Update: January 21, 2015</a></div>
</body>
</html>