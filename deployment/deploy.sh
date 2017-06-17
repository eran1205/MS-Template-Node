#! /bin/bash

scp  ./dist/ms-tmla-cases.tar seta@135.76.210.150:/opt/app/seta/tmla

ssh seta@135.76.210.150 'rm -rf /opt/app/seta/tmla/ms-tmla-cases'
ssh seta@135.76.210.150 'mkdir /opt/app/seta/tmla/ms-tmla-cases'

ssh seta@135.76.210.150 'tar -xzvf /opt/app/seta/tmla/ms-tmla-cases.tar -C /opt/app/seta/tmla/ms-tmla-cases/'
ssh seta@135.76.210.150 'pm2 restart /opt/app/seta/tmla/ms-tmla-cases/pm2-ecosystem.json'