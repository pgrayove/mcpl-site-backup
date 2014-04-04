<?php
	$connection = mysql_connect("localhost","root","mobob26");
	if (!$connection){
		die("Database connection failed: " . mysql_error());
	}
	
	$db_select = mysql_select_db("comminfo",$connection);
	if (!$db_select){
		die("Database selection failed: " . mysql_error());
	}
	
	$query = "SELECT service_id FROM service";
	$results = mysql_query($query, $connection);
	
	if(!empty($results)){
		$all_service_ids = array();
		while($this_service = mysql_fetch_array($results)){
			$all_service_ids[] = $this_service['service_id'];
		}
	} else {
		echo "<p>No services were found.</p>";
	}

	 foreach($all_service_ids as $service_id){
	 	$query = "SELECT subject.sub FROM service, sub_bridge, subject WHERE service.service_id = sub_bridge.service_id AND subject.subject_id = sub_bridge.subject_id AND service.service_id = ".$service_id;
	 	$results = mysql_query($query, $connection);
	 	
	 	if(!empty($results)){
	 		$all_subjects = "";
	 		while($this_row = mysql_fetch_array($results)){
	 			$all_subjects .= $this_row['sub']."::";
	 		}
	 		
	 		$all_subjects = substr_replace($all_subjects, "", -2); //remove trailing ", "
	 		//echo $all_subjects;
	 	} else {
	 		echo "<p>No results were returned!</p>";
	 	}
	 	
	 	$query = "UPDATE service SET subjects ='".$all_subjects."' WHERE service_id = ".$service_id;
	 	$results = mysql_query($query, $connection);
	 
	 	if(!empty($results)){
	 		echo "<p>".mysql_affected_rows($results)." records were updated.</p>";
	 	} else {
	 		echo "<p>No rows found; records were not updated.</p>";
	 	}
	 }

 ?>