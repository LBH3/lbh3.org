<?php
	require "../../php/web_constants.php";
?>
<!DOCTYPE HTML>
<html>
	<?php include '../../includes/html_head.php'; ?>
  <body>
    <header>
      <?php include '../../includes/header.html'; ?>
      <?php include '../../includes/top_nav.php'; ?>
    </header>
		<main class="container">
			<?php include '../../src/html/photos/2013.html'; ?>
		</main>
		<footer>
			<p class="container text-muted">
				For website issues, <a href="mailto:<?php echo wbm_email;?>">email <?php echo wbm_name;?></a>
			</p>
		</footer>
	</body>
</html>
