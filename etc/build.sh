rimraf dist

tsc --pretty

cp package.json dist/

rm -rf ~/.config/phoenix
cp -r dist ~/.config/phoenix

exit 0
