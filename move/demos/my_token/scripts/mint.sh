#!/bin/bash

# TreasuryCap Object ID: 0x677e283776cae53c846c5d9444e4ba2a7ffa010954dab004d5eea850c064b912
# Amount: 1000000000
# Recipient: 0xe5ae133b05ce17685d98817231c21fa2bc1777ea7da45cb2bd265dc52a96d5c3

sui client call \
     --package 0x0343d9c2d291ce2e9c4c00c4a133fdf06f82d50b2b7ada337721864dbeb3cde4 \
     --module my_token \
     --function mint \
     --args \
        0x677e283776cae53c846c5d9444e4ba2a7ffa010954dab004d5eea850c064b912 \
        1000000000 \
        0xe5ae133b05ce17685d98817231c21fa2bc1777ea7da45cb2bd265dc52a96d5c3