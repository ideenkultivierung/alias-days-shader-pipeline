# Python based Shaderpipeline in VRED

### Alias Days - January 2023

## Problem

- Shading CAD data can be time consuming
  - error-prone
  - less time for design iterations
  - frustrating
- Working with un-organized nurbs data
- Working with different file formats
- When there are errors its often needed to fix them in the source file

## Solution

- Use an automated shaderpipeline in VRED to do the time consuming work
- Automatically apply materials by using material libraries
- Use color coded base-materials or material names to shade the model
- Use fuzzy matching to shade even faster

## Prerequisits: Common Standards

- Agree on material naming conventions or RGB-color values (most-general case)

## Project Overview

- VRED Streaming App to control pipeline
  - React based
  - But: Could be just scripts, could be fully automated, could be a plugin in VRED
- Python libraries imported as python modules (Material Mapper)
- Mapping tables

## Material Mapping by RGB values and name matching

- RGB Mapping:

  - Look at all materials in the imported file
  - Get the RGB values of the diffuse channel using the field access
  - Use lookup table to find a matching color
  - If there is a matching color -> replace material!

- Name Mapping:
  - Look at all materials in the imported file
  - Get the name of the material
  - Use lookup table to find a matching name
  - If there is a matching name -> replace material!

## Improve Mapping using Fuzzy Matching

- Fuzzy Matching: Find also matches that are not 100% correct

  - Making errors is human
  - RGB values are off by a few percent
  - Material names have spelling errors

- Fuzzy Matching calculates a ratio on how simmilar two things are
- Define a threshold that defines how 'loosely' you want to match
- Helpful when doing fast iterations where not everything is correctly set up
- Keep working while a colleague fixes materials at the source
- Prevent manual fixing of these problems

## Further Improvements

- Run automated optimzations
  - Merge geometries
  - Merge materials
  - Reduce hierarchy depth (to improve performance in VR)

## Appendix 1 -
