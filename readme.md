# walkner-lkio

LAN Kontroler v3 I/O reader.

## Requirements

### node.js

  * __Version__: 10
  * __Website__: https://nodejs.org/
  * __Download__: https://nodejs.org/download/

### LAN Kontroler

  * __Version__: 3
  * __Website__: https://tinycontrol.pl/en/lan-controller-v3-3/

## Configuration

Configuration is passed as command line arguments:

* `--host` - hostname of the LAN Kontroler v3 (required).
* `--user` - username used for authorization (optional).
* `--pass` - password used for authorization (optional).
* `--tags` - a comma separated list of tags to read. If not specified, all tags are read.
* `--time` - a number of milliseconds to run the program for.
* `--timeout` - a number of milliseconds to wait for each read request to finish.
* `--all` - whether to return all current tag values on value change or only the changes.

Available tags:

* `sec0`
* `sec1`
* `sec2`
* `sec3`
* `sec4`
* `out`
* `out0`
* `out1`
* `out2`
* `out3`
* `out4`
* `out5`
* `pwm`
* `inp1`
* `inp2`
* `inp3`
* `inp4`
* `inp5`
* `inp6`
* `inpp1`
* `inpp2`
* `inpp3`
* `inpp4`
* `inpp5`
* `inpp6`
* `vin`
* `tem`
* `ind`
* `ind1`
* `ind2`
* `ind3`
* `ind4`
* `dth0`
* `dth1`
* `ds1`
* `ds2`
* `ds3`
* `ds4`
* `ds5`
* `ds6`
* `ds7`
* `ds8`
* `power1`
* `power2`
* `power3`
* `power4`
* `energy1`
* `energy2`
* `energy3`
* `energy4`
* `pm25`
* `pm10`
* `diff1`
* `diff2`
* `diffsel`
* `co2`
* `bm280p`

## Usage

The program can be run in the command line:

```
.\bin\lkio --host 192.168.1.100 --user admin --pass admin --time 10000 --timeout 1000 --all --tags out0,out1,out2,out3,out4,out5
```

## Result handling

All messages are written to the standard output stream as JSON objects. Each message is separated by a new line.

Every message has a `type` property. There are two types of messages: `error` and `tags`.

The `error` message has additional `code` and `message` properties with more error information:

```json
{
  "type": "error",
  "code": "INVALID_ARGUMENT",
  "message": "The --host argument is required."
}
```

The `tags` message has a `tags` property containing a map of tag names to values:

```json
{
  "type": "tags",
  "tags": {
    "out0": 1,
    "out2": 0,
    "out3": 0
  }
}
```

## License

This project is released under the [CC BY-NC-SA 4.0](https://raw.github.com/morkai/walkner-lkio/master/license.md).

Copyright (c) 2016, Łukasz Walukiewicz (lukasz@miracle.systems)
