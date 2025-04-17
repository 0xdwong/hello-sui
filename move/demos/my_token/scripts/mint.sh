#!/bin/bash

# Package ID: 0x6fb9ba60f29d536d99ec9e573262937284ab8c44b5a832578416cf4c975e7993
# TreasuryCap Object ID: 0x677e283776cae53c846c5d9444e4ba2a7ffa010954dab004d5eea850c064b912
# Amount: 1000000000
# Recipient: 0xe5ae133b05ce17685d98817231c21fa2bc1777ea7da45cb2bd265dc52a96d5c3

sui client call \
     --package 0x6fb9ba60f29d536d99ec9e573262937284ab8c44b5a832578416cf4c975e7993 \
     --module my_token \
     --function mint \
     --args \
        0x677e283776cae53c846c5d9444e4ba2a7ffa010954dab004d5eea850c064b912 \
        1000000000 \
        0xe5ae133b05ce17685d98817231c21fa2bc1777ea7da45cb2bd265dc52a96d5c3