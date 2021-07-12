SELECT sum(games.score) AS score, players.nickname FROM
	games INNER JOIN
		players ON players.player_id = games.player_id
	group by games.player_id
;
