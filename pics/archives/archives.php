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
			<h2>Photo Archive Pages</h2>
      <nav class="flex-column flex-sm-row nav nav-pills">
        <a class="flex-sm-fill nav-link text-sm-center" href="pics2014.php">2014</a>
        <a class="flex-sm-fill nav-link text-sm-center" href="pics2013.php">2013</a>
      </nav>
		</main>
		<footer>
			<p class="container text-muted">
				For website issues, <a href="mailto:<?php echo wbm_email;?>">email <?php echo wbm_name;?></a>
			</p>
		</footer>
	</body>
</html>
