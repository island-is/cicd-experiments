stuff="GreatStuff-$(date +%s)"
git checkout main
git pull
git checkout -b feature/$stuff
echo "Hallo${stuff}\n" >> ~/Source/cicd-experiments/stuff.txt
git add . git commit -m "adding${stuff}"
git push --set-upstream origin feature/${stuff}
