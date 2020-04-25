#!/bin/bash
curl -v --silent localhost:3000 2>&1 | grep "HTTP/1.1 200 OK"
if [ $? -eq 0 ]
then
  exit 0
else
  exit 1
fi
