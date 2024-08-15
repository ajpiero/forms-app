# Component Object Model for React

## Purpose

This is a experiment for my own understanding of React components model.  In order to answer is there a minimum representation of all the components (React or not) that can be used to calculate diff mechanism similar to the usage of virtual dom technologies.  If this is proved possible, we can achieve:

1. Optimize the representation of tree-structure React components representation to make React and similarly structured UI frameworks perform better
2. Serialized not only components data(like Redux), but also all components, at the each document(Single Page App) level

## Data structure

Proposed core data structure:
JavaScript objects tree and described as extended JSON, adding below features:

1. Reference

## Usage and APIs

1. Check diff
2. Serialize and Deserialize


## Approaches:

1. Try apply to Cvent's React application editor framework and see how can that be simplified.
2. read Inferno framework source code and understand how it performs better using a React-like components model.

## Learning Notes:

1. JSX is not only a syntax... The reason it good is because it clearly represent the components relationship, which can not be represented with JSON.   You can think of React.createElement as one way of mapping JSX to JS nested objects, which suggest JSX is applicable to any future view layer libraries using the same components model philosophy.
