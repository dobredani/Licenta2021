create table ads (
id serial NOT NULL,
adId VARCHAR(100) NOT NULL,
title VARCHAR(255),
descr TEXT,
location VARCHAR(100),
url VARCHAR(2000),
postedTimestamp TIMESTAMP,
price VARCHAR(50),
active BIT DEFAULT true
	)


