#!/bin/bash

echo ' _____ _____   ___   _   _   _____ ___  ___ _____ 
/  ___/  __ \ / _ \ | \ | | /  __ \|  \/  |/  ___|
\ `--.| /  \// /_\ \|  \| | | /  \/| .  . |\ `--. 
 `--. \ |    |  _  || . ` | | |    | |\/| | `--. \
/\__/ / \__/\| | | || |\  | | \__/\| |  | |/\__/ /
\____/ \____/\_| |_/\_| \_/  \____/\_|  |_/\____/ 
'

# creating file name variables
now=$(date +"%d_%m_%Y")
name_date="$1-$now"

# check if URL starts with http or https
if [[ $1 == https* ]];				# removing https://
then 
	out_file="${name_date:8}"
elif [[ $1 == http* ]];
then
	out_file="${name_date:7}"		# removing http://
else
	echo "Invalid URL, exiting..."
	exit 0
fi

echo ">TARGETTING" $1
echo ">OUTPUT FILE: $out_file"
echo
echo "----- Step 1: scanning for vulnerabilities -----"

# nuclei call, putting output in json file with designated name
# really fills the terminal with a lot of text but i'd rather make it as verbose as possible
# future upgrade: verbose flag when running script
docker run projectdiscovery/nuclei -target $1 -json > raw-outputs/$out_file.json
echo
echo "Generating JSON file..."
echo

# making the JSON file readable
jq --slurp . < raw-outputs/$out_file.json > raw-outputs/$out_file-clean.json
rm raw-outputs/$out_file.json

# need to make sure nuclei here actually returned something just in case, exit 0 if not

# cleaning data and filtered-JSON (parameter) directories and moving newly generated .json file
rm -f data/*
rm -f filtered-JSON/*

# letting raw-outputs file stay for traceability when debugging
cp raw-outputs/$out_file-clean.json data/$out_file.json

echo "----- Step 2: detecting CMS -----"
node src/nameCMS.js
echo

echo "----- Step 3: generating output -----"
node src/outputClassifier.js
echo
echo "----- Step 4: generating HTML output -----"
node src/script.js
echo
echo Finishing execution...
