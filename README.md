# Textr

Textr will provide a list of shortcuts to make your typing even faster.
Create a custom list of the most common typed words to get started.

### The following information is displayed:

* info1
* info2
* info3

Please submit bug reports to [Insert Link](). Pull requests are welcome.

### Screenshot(s):
[put your screenshots down here.]


#### Dev notes

app will update the json in settings
hidden settings to store the key value pair
initial value = a few shortcuts
We will keep the shortcuts.json as reference

The default JSON used in the manifest is shown below:
`{
  "shared": {
    "tks": "thanks",
    "ta": "thanks",
    "zd": "Zendesk"
  },
  "3616907518": {
    "cu": "custom"
  }
}`

For the `zat validate` to pass it needs to be in one line.
"{\"shared\": {\"tks\": \"thanks\",\"ta\": \"thanks\",\"zd\": \"Zendesk\"},\"3616907518\": {\"cu\": \"custom\"}}"
