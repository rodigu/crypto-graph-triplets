- [Use instructions](#use-instructions)
  - [History registration](#history-registration)
  - [Continuous loop](#continuous-loop)

The Python code for visualizing the network can be found in [the graphVis file](graphVis.py).

Graph data visualizations: https://colab.research.google.com/drive/1acU5-x7wnnEvgLnexv7ZuIzChGmbt71F?usp=sharing

## Use instructions

### History registration

To register historical data, run the file `register_history.ts` using deno:

```bash
deno run --allow-read --allow-net --allow-write register_history.ts FROM TIME DELAY FOLDER
```

Substitute the uppercase names with the following information:

- `FROM`: `us` or `com` (US or Chinese Binance data, respectively)
- `TIME`: how much time the data collection will run for in minutes
- `DELAY`: time in seconds between each data collection
- `FOLDER`: folder where history will be registered

### Continuous loop

The file `looper.ts` will repeatedly display the top `NUM` triplets:

```bash
deno run --allow-net looper.ts FROM NUM
```

- `FROM`: `us` or `com` (US or Chinese Binance data, respectively)
- `NUM`: number of triplets to be displayed
