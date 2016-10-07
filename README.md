WebRTC Experiment
=================

A WebRTC experiment

Install
-------

    $ git clone https://github.com/satori99/webrtc.git
    $ cd webrtc
    $ npm install

Start
-----

Start an application server with the following command

    $ node src/master

or

    $ npm start

OpenShift
---------

This app is designed to work with OpenShift. The application can be created
with the following command:

    $ rhc app create <APP_NAME> \
    > https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml \
    > https://cartreflect-claytondev.rhcloud.com/reflect?github=smarterclayton/openshift-redis-cart \
    > --from-code=https://github.com/satori99/webrtc.git


Show logs

    $rhc tail -a <APP_NAME>

