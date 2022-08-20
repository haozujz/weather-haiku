# Weather haiku

https://weather-haiku.glitch.me/

Haiku generator, answers user input with a short-form poem consisting of phonetic units or syllables in a 5-7-5 pattern. Output can be influenced by the state of the canvas eg. rain/snow, sun position etc.

## Notes

Demonstrative proof-of-concept only, do not submit your api key without understanding the risks! 
The newer text-davinci models exhibit greater understanding of syllables with little training samples whereas older models required an assortment of extra labels.

## Potential updates

- Fine-tune model with haiku datasets. 
- Experiment with lower-cost base models. 
- Expand the influence of canvas to include semantics.
- Arbitrarily ensure 5-7-5 pattern: Run additional code post-prediction to convert output into true phonetic units, adjust phrases/words accordingly to 'fix' model output and ensure 5-7-5 pattern.
