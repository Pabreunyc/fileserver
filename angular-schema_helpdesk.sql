CREATE TABLE `hd_tickets` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `assignedTo` int(11) DEFAULT '0' COMMENT 'a specific admin',
  `subject` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `dateCreated` datetime NOT NULL,
  `status` int(11) NOT NULL,
  `productId` int(10) unsigned NOT NULL,
  `categoryId` int(10) unsigned NOT NULL,
  `priorityId` int(10) unsigned NOT NULL,
  `title` varchar(64) DEFAULT NULL,
  `department` varchar(64) DEFAULT NULL,
  `phone` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ============================================================================
CREATE TABLE `hd_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticketId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `dateCreated` datetime NOT NULL,
  `type` char(8) NOT NULL DEFAULT '',
  `comment` text NOT NULL,
  `internal_note` text COMMENT 'only support staff can see this',
  PRIMARY KEY (`id`),
  KEY `ticket_idx` (`ticketId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- ============================================================================

CREATE TABLE `hd_attachments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filename` varchar(128) NOT NULL,
  `filetype` varchar(128) NOT NULL,
  `filesize` int(11) NOT NULL,
  `filepath` varchar(4095) NOT NULL,
  `dateCreated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ============================================================================

CREATE TABLE `hd_tickets_meta` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `meta` varchar(16) NOT NULL,
  `label` varchar(24) NOT NULL,
  `seq` tinyint(4) NOT NULL DEFAULT '0',
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8;