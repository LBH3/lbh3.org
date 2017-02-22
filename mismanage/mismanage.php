<?php
	require "../php/web_constants.php";
?>
<!DOCTYPE HTML>
<html>
	<?php include '../includes/html_head.php'; ?>
  <body>
		<header>
			<?php include '../includes/header.html'; ?>
			<?php include '../includes/top_nav.php'; ?>
		</header>
		<main class="container">
			<h2>2017 Mismanagement</h2>
			<h3>Grand Masters</h3>
			<ul>
				<li><a href="mailto:<?php echo gm1_email;?>"><?php echo gm1_name;?></a></li>
				<li><a href="mailto:<?php echo gm2_email;?>"><?php echo gm2_name;?></a></li>
			</ul>
			<h3>Trail Master</h3>
			<ul>
				<li><a href="mailto:<?php echo tm1_email;?>"><?php echo tm1_name;?></a></li>
				<li><a href="mailto:<?php echo tm2_email;?>"><?php echo tm2_name;?></a></li>
			</ul>
			<h3>Brewmeisters</h3>
			<ul>
				<li><a href="mailto: <?php echo bm1_email;?>"><?php echo bm1_name;?></a></li>
				<li><a href="mailto: <?php echo bm2_email;?>"><?php echo bm2_name;?></a></li>
			</ul>
			<h3>Hash Cash</h3>
			<ul>
				<li><a href="mailto: <?php echo hc1_email;?>"><?php echo hc1_name;?></a></li>
				<li><a href="mailto:<?php echo hc2_email;?>"><?php echo hc2_name;?></a></li>
			</ul>
			<h3>On Disk</h3>
			<ul>
				<li><a href="mailto: <?php echo od1_email;?>"><?php echo od1_name;?></a></li>
				<li><a href="mailto: <?php echo od2_email;?>"><?php echo od2_name;?></a></li>
			</ul>
			<h3>Haberdashery</h3>
			<ul>
				<li><a href="mailto:<?php echo hb1_email;?>"><?php echo hb1_name;?></a></li>
				<li><a href="mailto:<?php echo hb2_email;?>"><?php echo hb2_name;?></a></li>
			</ul>
			<h3>Munchmeister</h3>
			<ul>
				<li><a href="mailto: <?php echo mm1_email;?>"><?php echo mm1_name;?></a></li>
				<li><a href="mailto: <?php echo mm2_email;?>"><?php echo mm2_name;?></a></li>
			</ul>
			<h3>On Sec</h3>
			<ul>
				<li><a href="mailto: <?php echo os1_email;?>"><?php echo os1_name;?></a></li>
				<li><a href="mailto: <?php echo os2_email;?>"><?php echo os2_name;?></a></li>
			</ul>
			<h3>Hash Flash</h3>
			<ul>
				<li><a href="mailto: <?php echo hf1_email;?>"><?php echo hf1_name;?></a></li>
				<li><a href="mailto: <?php echo hf2_email;?>"><?php echo hf2_name;?></a></li>
			</ul>
			<h3>Hash Historian</h3>
			<ul>
				<li><a href="mailto:<?php echo hh_email;?>"><?php echo hh_name;?></a> <?php echo hh_phone;?></li>
			</ul>
			<h3>Webmaster LBH3</h3>
			<ul>
				<li><a href="mailto: <?php echo wbm_email;?>"><?php echo wbm_name;?></a></li>
			</ul>
		</main>
		<footer>
			<p class="container text-muted">
				For website issues, <a href="mailto:<?php echo wbm_email;?>">email <?php echo wbm_name;?></a>
			</p>
		</footer>
	</body>
</html>
