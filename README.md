# Weather haiku

https://weather-haiku.glitch.me/

Haiku generator, answers user input with a short-form poem consisting of phonetic units or syllables in a 5-7-5 pattern. Output can be influenced pre-prediction by the state of the canvas eg. rain/snow level, sun position etc.

## Notes

Demonstrative proof-of-concept only, do not submit your api key without understanding the risks!   
The newer text-davinci models exhibit greater understanding of syllables with few training samples whereas older models required an assortment of additional labels. Conversely, including such additional labels in the newer model resulted in poorer output than an older model.

## Potential updates

- Fine-tune model with haiku datasets. 
- Experiment with lower-cost base models. 
- Expand the influence of canvas to include semantics.
- Post-process output to arbitrarily conform to 5-7-5 pattern: eg. convert output into true phonetic units, adjust phrases/words accordingly to 'fix' model output and ensure 5-7-5 pattern.
