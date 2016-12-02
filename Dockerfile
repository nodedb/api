########################################
# Docker                               #
#                                      #
# A NodeJS container that enables the  #
# application to run                   #
########################################

FROM node:6

MAINTAINER Simon Emms, simon@simonemms.com

# Set the work directory and add the project files to it
WORKDIR /opt/nodedb
ADD . /opt/nodedb

# Environment variables

# Install the dependencies
RUN npm install -g bunyan

# Expose the port
EXPOSE 9999
EXPOSE 5858

# Run run run
CMD npm start | bunyan
