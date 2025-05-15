
#!/bin/bash

# package ID: 0x0343d9c2d291ce2e9c4c00c4a133fdf06f82d50b2b7ada337721864dbeb3cde4
# TreasuryCap Object ID: 0x677e283776cae53c846c5d9444e4ba2a7ffa010954dab004d5eea850c064b912
# Amount: 1000000000
# MTK Object ID: 0x98067dd0f959d90b041116e0961dbaf36f8bd6f0a3c38f803012efd335df2417


sui client call \
    --package 0x0343d9c2d291ce2e9c4c00c4a133fdf06f82d50b2b7ada337721864dbeb3cde4 \
    --module my_token \
    --function burn \
    --args \
    0x677e283776cae53c846c5d9444e4ba2a7ffa010954dab004d5eea850c064b912 \
    0x98067dd0f959d90b041116e0961dbaf36f8bd6f0a3c38f803012efd335df2417
 