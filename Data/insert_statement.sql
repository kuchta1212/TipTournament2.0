﻿begin transaction

insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('australia','Austrálie', 'icons/australia.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('iran','Irán', 'icons/iran.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('japan','Japansko', 'icons/japan.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('qatar','Katar', 'icons/qatar.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('saudiarabia','Saudská Arábie', 'icons/saudiarabia.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('southkorea','Jižní Korea', 'icons/southkorea.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('cameroon','Kamerun', 'icons/cameroon.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('ghana','Ghana', 'icons/ghana.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('morocco','Moroko', 'icons/morocco.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('senegal','Senegal', 'icons/senegal.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('tunisia','Tunisko', 'icons/tunisia.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('canada','Kanada', 'icons/canada.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('costarica','Kosta Rica', 'icons/costarica.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('mexico','Mexico', 'icons/mexico.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('unitedstates','Spojené státy', 'icons/unitedstates.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('argentina','Argentina', 'icons/argentina.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('brazil','Brazílie', 'icons/brazil.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('ecuador','Ekvádor', 'icons/ecuador.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('uruguay','Uruguay', 'icons/uruguay.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('belgium','Belgie', 'icons/belgium.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('croatia','Chorvatsko', 'icons/croatia.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('denmark','Dánsko', 'icons/denmark.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('england','Anglie', 'icons/england.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('france','Francie', 'icons/france.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('germany','Německo', 'icons/germany.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('netherlands','Nizozemsko', 'icons/netherlands.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('poland','Polsko', 'icons/poland.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('portugal','Portugalsko', 'icons/portugal.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('serbia','Srbsko', 'icons/serbia.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('spain','Spanelsko', 'icons/spain.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('switzerland','Svycarsko', 'icons/switzerland.svg',0)
insert into dbo.Teams(Id, Name, IconPath, FinishedAt) values ('wales','Wales', 'icons/wales.svg',0)

insert into dbo.Groups(Id, GroupName) values ('Id_Group_A','Skupina A')
insert into dbo.Groups(Id, GroupName) values ('Id_Group_B','Skupina B')
insert into dbo.Groups(Id, GroupName) values ('Id_Group_C','Skupina C')
insert into dbo.Groups(Id, GroupName) values ('Id_Group_D','Skupina D')
insert into dbo.Groups(Id, GroupName) values ('Id_Group_E','Skupina E')
insert into dbo.Groups(Id, GroupName) values ('Id_Group_F','Skupina F')
insert into dbo.Groups(Id, GroupName) values ('Id_Group_G','Skupina G')
insert into dbo.Groups(Id, GroupName) values ('Id_Group_H','Skupina H')

insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_1','2022-11-20 19:00',0,'ecuador','Id_Group_A','qatar')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_2','2022-11-21 19:00',0,'netherlands','Id_Group_A','senegal')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_18','2022-11-25 16:00',0,'senegal','Id_Group_A','qatar')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_19','2022-11-25 19:00',0,'ecuador','Id_Group_A','netherlands')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_35','2022-11-29 18:00',0,'senegal','Id_Group_A','ecuador')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_36','2022-11-29 18:00',0,'qatar','Id_Group_A','netherlands')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_3','2022-11-21 16:00',0,'iran','Id_Group_B','england')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_4','2022-11-21 22:00',0,'wales','Id_Group_B','unitedstates')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_17','2022-11-25 13:00',0,'iran','Id_Group_B','wales')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_20','2022-11-25 22:00',0,'unitedstates','Id_Group_B','england')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_33','2022-11-29 22:00',0,'england','Id_Group_B','wales')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_34','2022-11-29 22:00',0,'unitedstates','Id_Group_B','iran')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_8','2022-11-22 13:00',0,'saudiarabia','Id_Group_C','argentina')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_7','2022-11-22 19:00',0,'poland','Id_Group_C','mexico')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_22','2022-11-26 16:00',0,'saudiarabia','Id_Group_C','poland')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_24','2022-11-26 22:00',0,'mexico','Id_Group_C','argentina')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_39','2022-11-30 22:00',0,'argentina','Id_Group_C','poland')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_40','2022-11-30 22:00',0,'mexico','Id_Group_C','saudiarabia')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_6','2022-11-22 16:00',0,'tunisia','Id_Group_D','denmark')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_5','2022-11-22 22:00',0,'australia','Id_Group_D','france')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_21','2022-11-26 13:00',0,'australia','Id_Group_D','tunisia')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_23','2022-11-26 19:00',0,'denmark','Id_Group_D','france')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_37','2022-11-30 18:00',0,'denmark','Id_Group_D','australia')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_38','2022-11-30 18:00',0,'france','Id_Group_D','tunisia')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_11','2022-11-23 16:00',0,'japan','Id_Group_E','germany')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_10','2022-11-23 19:00',0,'costarica','Id_Group_E','spain')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_25','2022-11-27 13:00',0,'costarica','Id_Group_E','japan')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_28','2022-11-27 22:00',0,'germany','Id_Group_E','spain')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_43','2022-12-1 22:00',0,'spain','Id_Group_E','japan')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_44','2022-12-1 22:00',0,'germany','Id_Group_E','costarica')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_12','2022-11-23 13:00',0,'croatia','Id_Group_F','morocco')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_9','2022-11-23 22:00',0,'canada','Id_Group_F','belgium')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_26','2022-11-27 16:00',0,'morocco','Id_Group_F','belgium')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_27','2022-11-27 19:00',0,'canada','Id_Group_F','croatia')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_41','2022-12-1 18:00',0,'belgium','Id_Group_F','croatia')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_42','2022-12-1 18:00',0,'morocco','Id_Group_F','canada')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_13','2022-11-24 13:00',0,'cameroon','Id_Group_G','switzerland')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_16','2022-11-24 22:00',0,'serbia','Id_Group_G','brazil')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_29','2022-11-28 13:00',0,'serbia','Id_Group_G','cameroon')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_31','2022-11-28 19:00',0,'switzerland','Id_Group_G','brazil')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_47','2022-12-2 22:00',0,'switzerland','Id_Group_G','serbia')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_48','2022-12-2 22:00',0,'brazil','Id_Group_G','cameroon')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_14','2022-11-24 16:00',0,'southkorea','Id_Group_H','uruguay')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_15','2022-11-24 19:00',0,'ghana','Id_Group_H','portugal')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_30','2022-11-28 16:00',0,'ghana','Id_Group_H','southkorea')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_32','2022-11-28 22:00',0,'uruguay','Id_Group_H','portugal')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_45','2022-12-2 18:00',0,'uruguay','Id_Group_H','ghana')
insert into dbo.Matches(Id, StartTime, Ended, AwayId, GroupId, HomeId) values ('match_46','2022-12-2 18:00',0,'portugal','Id_Group_H','southkorea')

update dbo.Matches
set Stage = 0

insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_49','2022-12-3 18:00',0,1)
insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_50','2022-12-3 22:00',0,1)
insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_52','2022-12-4 18:00',0,1)
insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_51','2022-12-4 22:00',0,1)
insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_53','2022-12-5 18:00',0,1)
insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_54','2022-12-5 22:00',0,1)
insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_55','2022-12-6 18:00',0,1)
insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_56','2022-12-6 22:00',0,1)

insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_58','2022-12-9 18:00',0,2)
insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_57','2022-12-9 22:00',0,2)
insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_60','2022-12-10 18:00',0,2)
insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_59','2022-12-10 22:00',0,2)

insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_61','2022-12-13 22:00',0,3)
insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_62','2022-12-14 22:00',0,3)

insert into dbo.Matches(Id, StartTime, Ended, Stage) values ('match_64','2022-12-18 18:00',0,4)

commit
