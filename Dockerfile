FROM docker.adeo.no:5000/bekkci/npm-builder as npm-build
ADD /web/src/frontend ${SOURCE_DIR}
RUN build ${SOURCE_DIR}

FROM docker.adeo.no:5000/bekkci/maven-builder as maven-build
ADD / ${SOURCE_DIR}
COPY --from=npm-build /main/webapp ${SOURCE_DIR}/web/src/main/webapp
RUN build ${SOURCE_DIR}