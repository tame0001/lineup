import random


# read the list of team members from a file
def read_team_members(file_path):
    with open(file_path, "r") as file:
        members = [line.strip() for line in file.readlines()]
    return members


players = read_team_members("player_list.txt")


# filter players by second parameter
def filter_players(players, parameter=1):
    return [
        player.split(",")[0].strip()
        for player in players
        if player.split(",")[1].strip() == parameter
    ]


n_team = len(players) // 6
players_g1 = filter_players(players, "1")
players_g0 = filter_players(players, "0")


# randomly split the players into n_team teams
def split_players(players, n_team):
    random.shuffle(players)
    return [players[i::n_team] for i in range(n_team)]


teams = split_players(players_g1, n_team)

filing_teams = split_players(players_g0, n_team)

for g0, g1 in zip(filing_teams, teams):
    for player in g0 + g1:
        print(player)
    print("-----")
