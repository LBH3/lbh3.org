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
		<h2>2017 Mismanagement</h2>
		<div class="mm_role">
			<div class="mm_title">Grand Masters</div>
			<ul>
				<li class="mm_members"><a href="mailto:<?php echo gm1_email;?>"><?php echo gm1_name;?></a></li>
				<li class="mm_members"><a href="mailto:<?php echo gm2_email;?>"><?php echo gm2_name;?></a></li>
			</ul>
		</div>
		<div class="mm_role">
			<div class="mm_title">Trail Master</div>
			<ul>
				<li class="mm_members"><a href="mailto:<?php echo tm1_email;?>"><?php echo tm1_name;?></a></li>
				<li class="mm_members"><a href="mailto:<?php echo tm2_email;?>"><?php echo tm2_name;?></a></li>
			</ul>
		</div>
		<div class="mm_role">
			<div class="mm_title">Brewmeisters</div>
			<ul>
				<li class="mm_members"><a href="mailto: <?php echo bm1_email;?>"><?php echo bm1_name;?></a></li>
			</ul>
		</div>
		<div class="mm_role">
			<div class="mm_title">Hash Cash</div>
			<ul>
				<li class="mm_members"><a href="mailto: <?php echo hc1_email;?>"><?php echo hc1_name;?></a></li>
				<li class="mm_members"><a href="mailto:<?php echo hc2_email;?>"><?php echo hc2_name;?></a></li>
			</ul>
		</div>
		<div class="mm_role">
			<div class="mm_title">On Disk</div>
			<ul>
				<li class="mm_members"><a href="mailto: <?php echo od1_email;?>"><?php echo od1_name;?></a></li>
				<li class="mm_members"><a href="mailto: <?php echo od2_email;?>"><?php echo od2_name;?></a></li>
			</ul>
		</div>
		<div class="mm_role">
			<div class="mm_title">Haberdashery</div>
			<ul>
				<li class="mm_members"><a href="mailto:<?php echo hb1_email;?>"><?php echo hb1_name;?></a></li>
				<li class="mm_members"><a href="mailto:<?php echo hb2_email;?>"><?php echo hb2_name;?></a></li>
			</ul>
		</div>
		<div class="mm_role">
			<div class="mm_title">Munchmeister</div>
			<ul>
				<li class="mm_members"><a href="mailto: <?php echo mm1_email;?>"><?php echo mm1_name;?></a></li>
				<li class="mm_members"><a href="mailto: <?php echo mm2_email;?>"><?php echo mm2_name;?></a></li>
			</ul>
		</div>
		<div class="mm_role">
			<div class="mm_title">On Sec</div>
			<ul>
				<li class="mm_members"><a href="mailto: <?php echo os1_email;?>"><?php echo os1_name;?></a></li>
				<li class="mm_members"><a href="mailto: <?php echo os2_email;?>"><?php echo os2_name;?></a></li>
			</ul>
		</div>
		<div class="mm_role">
			<div class="mm_title">Hash Flash</div>
			<ul>
				<li class="mm_members"><a href="mailto: <?php echo hf1_email;?>"><?php echo hf1_name;?></a></li>
				<li class="mm_members"><a href="mailto: <?php echo hf2_email;?>"><?php echo hf2_name;?></a></li>
			</ul>
		</div>
		<div class="mm_role">
			<div class="mm_title">Hash Historian</div>
			<ul>
				<li class="mm_members"><a href="mailto:<?php echo hh_email;?>"><?php echo hh_name;?></a> <?php echo hh_phone;?></li>
			</ul>
		</div>
		<div class="mm_role_last">
			<div class="mm_title">Webmaster LBH3</div>
			<ul>
				<li class="mm_members"><a href="mailto: <?php echo wbm_email;?>"><?php echo wbm_name;?></a></li>
			</ul>
		</div>
	</div>
	<div class="clear"></div>
</div>
	<div id="footer"><span class="wbm">For website issues, contact <a href="mailto: <?php echo wbm_email;?>"><?php echo wbm_name;?></a></span><span class="lastupdate">Last Update: February 13, 2017</a></div>
</body>
</html>
