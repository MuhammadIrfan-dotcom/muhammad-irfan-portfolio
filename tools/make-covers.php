<?php
function cover($path, $title, $c1, $c2) {
  $w = 1200;
  $h = 675;
  $im = imagecreatetruecolor($w, $h);
  for ($y = 0; $y < $h; $y++) {
    $t = $y / ($h - 1);
    $r = (int) ((1 - $t) * hexdec(substr($c1, 0, 2)) + $t * hexdec(substr($c2, 0, 2)));
    $g = (int) ((1 - $t) * hexdec(substr($c1, 2, 2)) + $t * hexdec(substr($c2, 2, 2)));
    $b = (int) ((1 - $t) * hexdec(substr($c1, 4, 2)) + $t * hexdec(substr($c2, 4, 2)));
    $col = imagecolorallocate($im, $r, $g, $b);
    imageline($im, 0, $y, $w, $y, $col);
  }
  $white = imagecolorallocate($im, 255, 255, 255);
  $muted = imagecolorallocatealpha($im, 255, 255, 255, 90);
  imagefilledellipse($im, 980, 120, 420, 420, $muted);
  imagefilledellipse($im, 180, 520, 360, 360, $muted);
  $badge = imagecolorallocatealpha($im, 0, 0, 0, 70);
  imagefilledrectangle($im, 60, 520, 1140, 620, $badge);
  $font = 5;
  $label = 'Upwork Portfolio';
  $lw = imagefontwidth($font) * strlen($label);
  imagestring($im, $font, (int) (($w - $lw) / 2), 540, $label, $white);
  $tw = imagefontwidth($font) * strlen($title);
  imagestring($im, $font, (int) (($w - $tw) / 2), 570, $title, $white);
  imagepng($im, $path);
  imagedestroy($im);
  echo "wrote $path\n";
}

$dir = __DIR__ . '/../assets/projects/';
cover($dir . 'upwork-payment.png', 'Universal Payment Support System', '0D7377', '14919B');
cover($dir . 'upwork-hms.png', 'HMS System', '1B4F72', '2E86AB');
cover($dir . 'upwork-p3.png', 'Full Stack Client Delivery', '6B2D5C', 'C44536');
cover($dir . 'upwork-p4.png', 'Product Build', '2C3E50', 'E67E22');
cover($dir . 'upwork-p5.png', 'Custom Web & API', '1A5276', '27AE60');
