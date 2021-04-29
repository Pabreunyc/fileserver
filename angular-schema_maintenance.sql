CREATE TABLE `tbl_maintenance_logs` (
  `record_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `log_description` varchar(500) DEFAULT NULL,
  `file_source_path` varchar(500) DEFAULT NULL,
  `file_full_path` varchar(500) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL,
  `date_uploaded` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=utf8;