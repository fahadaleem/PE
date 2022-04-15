

CREATE TABLE users (
	id bigserial ,
	username varchar(255) NOT NULL,
	email varchar(255) UNIQUE,
	password varchar(255) NOT NULL,
	role varchar(25) NOT NULL
);

INSERT INTO users (username, email, password, role) VALUES (
	'fahad aleem', 'fahad.aleem@ivl.com','123456', 'Admin'
);

CREATE TABLE formSection (
	sectionid bigint primary key,
	sectiontitle varchar(255) not null,
	sectiondescription text not null
);

INSERT INTO formSection (sectionid, sectiontitle, sectionDescription) VALUES (
1, 'PERFORMANCE OF DUTIES', 'Measures an officer ability to manage and to get thins done'
);

CREATE TABLE questions (
	id bigint primary key,
	questiontitle varchar(255) not null,
	questiondescription varchar(255) not null,
	options json null null,
	fk_formSections int references formsection(sectionid));

INSERT INTO questions VALUES (1, 'Planning and preparedness', 'Ability to anticipate, determine goals, identify relevant information, set priorities and deadlines and create a shared vision of the unit and coast guard future', '[{"optionTitle":"Got caught", "optionWeightage":"3"}]', 1);

CREATE TABLE students (
	pNO serial primary key, 
	userName varchar(255) not null, 
	fatherName varchar(255) not null, 
	courseName varchar(255) not null
);

insert into students (userName, fatherName, courseName) values ('fahad aleem','muhammad aleem', 'ICS');