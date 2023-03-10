
## Install all requirements

```pip install -r requirements.txt```


## Diff Generation:

```python process.py diff```


then open diff/diff.csv and copy lines to hearsapp translation spreadsheet


## Genrating language files:

Download hearsapp translation spreadsheet as xlsx file.
Replace heartsapp_v2_translations.xlsx in lang dir with this new file , keep the name same.
empty lang/out dir 
then run 

```python process.py reverse```

It generates the language files. 
