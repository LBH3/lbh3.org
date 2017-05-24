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
			<p>For questions or to sign up for a run, contact our Trail Master(s), <a href="mailto:<?php echo tm1_email;?>"><?php echo tm1_name;?></a> or <a href="mailto:<?php echo tm2_email;?>"><?php echo tm2_name;?></a>.</p>
			<p>LBH3 <a href="../pdfs/LBH3HaringGuidelines69.pdf">Haring Guidelines</a></p>

			<?php include '../src/html/hareline/2017.html'; ?>
		</main>
		<footer>
			<p class="container text-muted">
				For website issues, <a href="mailto:<?php echo wbm_email;?>">email <?php echo wbm_name;?></a>
			</p>
		</footer>
	</body>
</html>
