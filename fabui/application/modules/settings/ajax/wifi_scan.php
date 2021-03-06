<?php 
require_once $_SERVER['DOCUMENT_ROOT'].'/fabui/application/helpers/os_helper.php';
$networks = scan_wlan();
$mac_address = $_POST['mac_address'];

?>

<?php if(count($networks) > 0): ?>
	<table class="table table-striped table-forum">
		
		<tbody>
			<?php foreach($networks as $net): ?>
				<?php if($net['essid'] != ''): ?>
				<?php $action =  $net['address'] == $mac_address ? 'disconnect' : 'connect'; $protected = $net['encryption key'] == 'on' ? true : false; ?>
					<tr>
						<td class="text-center" style="width: 40px;"><i class="icon-communication-035 fa-2x text-muted"></i></td>
						<td style="width: 200px">
							<h4><a href="javascript:void(0);"> <?php echo $net['essid']; ?> <?php if($action == 'disconnect'): ?> <i class="fa fa-check pull-right"></i> <?php endif; ?></a>
								<small><?php echo $protected ? 'Protected ('.$net['type'].')' : 'Open'; ?> <i class="fa fa-<?php echo $protected ? 'lock' :'unlock'  ?>"></i></small>
							</h4>
						</td>
						<td class="hidden-xs">
							<div class="progress progress-striped active">
								<div class="progress-bar  bg-color-blue" data-transitiongoal="<?php echo $net['signal_level'] ?>"></div>
							</div>
						</td>
						<td style="width: 100px" class="text-right">
							<button data-type="<?php echo $net['type']; ?>" data-protected="<?php echo $net['encryption key'];?>" data-ssid="<?php echo $net['essid']; ?>" data-action="<?php echo $action; ?>" class="btn btn-info btn-block <?php echo $action; ?>"><?php echo ucfirst($action); ?></button>
						</td>
					</tr>
				<?php endif; ?>
			<?php endforeach; ?>
		</tbody>
	</table>
<?php else: ?>
	<div class="alert alert-warning fade in">
		<i class="fa-fw fa fa-warning"></i>
		<strong>Warning</strong> No wireless networks found. Try to scan again.
	</div>
<?php endif; ?>