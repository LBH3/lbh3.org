<?php

require "../php/web_constants.php";

$hash_history_directory = 'this-week-in-hash-history/';
$files = scandir($hash_history_directory);
$latest_hash_history_pdf = $hash_history_directory . array_pop($files);

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
			<h2>The History of The Hash House Harriers &amp; The Founding of LBH3</h2>

			<p>Established January 6 1985</p>
			<p>Founded by: Dal “Jock” Trader</p>
			<p>Jerry “Eject” Templeman</p>
			<p>Andy “Zapata” Limon</p>

			<p><a href="HowLBH3Started.pdf">How LBH3 Started</a></p>
			<p><a href="<?php echo $latest_hash_history_pdf; ?>">This Week in LBH3 Hash History</a></p>
			<p><a href="<?php echo getenv('ROOT_PATH'); ?>mismanage/mismanage.php">Mismanagement</a></p>
			<p><a href="FounderSkit.pdf">Found'ers Skit</a></p>
			<p><a href="Whosleptwithbigpink.pdf">Who Slept With Big Pink</a></p>
			<p><a href="HotLips.pdf">Hot Lips Adventures</a></p>
			<p><a href="LBH3SongBook.pdf">LBH3 Song Book</a></p>
			<p><a href="LBH3HaringGuidelines.pdf">LBH3 Haring Guidelines</a></p>

		</main>
		<footer>
			<p class="container text-muted">
				For website issues, <a href="mailto:<?php echo wbm_email;?>">email <?php echo wbm_name;?></a>
			</p>
		</footer>
	</body>
</html>
