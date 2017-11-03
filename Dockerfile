FROM docker.adeo.no:5000/bekkci/npm-builder as npm-build
ADD /web/src/frontend /source
RUN build /source

FROM docker.adeo.no:5000/bekkci/maven-builder as maven-build
ADD / /source
COPY --from=npm-build /main/webapp /source/web/src/main/webapp
RUN build /source

FROM docker.adeo.no:5000/bekkci/skya-deployer
COPY --from=maven-build /source /deploy
RUN deploy /deploy
