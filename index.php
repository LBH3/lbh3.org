<?php require "php/web_constants.php"; ?>
<!DOCTYPE HTML>
<html>
	<?php include 'includes/html_head.php'; ?>
  <body>
    <header>
      <?php include 'includes/header.html'; ?>
      <?php include 'includes/top_nav.php'; ?>
    </header>
    <main class="container home">
      <p>
        <small>
          The Long Beach kennel was founded over 30 years ago.
          We run Thursday evening during Spring/Summer &amp; Sunday morning in the Fall/Winter.
          We often have an attendance of 75+.
          Visitors &amp; Virgins are always welcome!
          Your run donation covers Hare essentials, pre– and post–run beer/soda/munchies.
          Please bring a vessel for your beverage.
          We hope to see you at LBH3.
          On On!!!
        </small>
      </p>

			<hr>

			<?php include 'pastruns/runs/lbh3_1809_20170525.html'; ?>
    </main>
    <footer>
      <p class="container text-muted">
        For website issues, <a href="mailto:<?php echo wbm_email;?>">email <?php echo wbm_name;?></a>
      </p>
    </footer>
  </body>
</html>
