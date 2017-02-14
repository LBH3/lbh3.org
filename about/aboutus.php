<?php

require "../php/web_constants.php";

$hash_history_directory = 'this-week-in-hash-history/';
$files = scandir($hash_history_directory);
$latest_hash_history_pdf = $hash_history_directory . array_pop($files);

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
				<h2><p>The History of The Hash House Harriers</p>
				 <p> & The Founding of LBH3</p></h2>

			<p><span class="big"><br>
			<p>Established January 6 1985</p>
			<p>Founded by: Dal "Jock" Trader</p>
			<p>Jerry "Eject" Templeman</p>
			<p>Andy "Zapata" Limon</p>
			<span class="big"></span></p><br>

				<p><a href="HowLBH3Started.pdf">How LBH3 Started</a></p>
				<p><a href="FounderSkit.pdf">Found'ers Skit</a></p>
				<p><a href="Whosleptwithbigpink.pdf">Who Slept With Big Pink</a></p>
				<p><a href="HotLips.pdf">Hot Lips Adventures</a></p>
				<p><a href="LBH3SongBook.pdf">LBH3 Song Book</a></p>
				<p><a href="LBH3HaringGuidelines.pdf">LBH3 Haring Guidelines</a></p>
				<p><a href="<?php echo $latest_hash_history_pdf; ?>">This Week in LBH3 Hash History</a></p>

			</div>
			<div class="clear"></div>
		</div>
		<div id="footer">
			<span class="wbm">For website issues, contact <a href="mailto: <?php echo wbm_email;?>"><?php echo wbm_name;?></a></span>
		</div>
	</body>
</html>
