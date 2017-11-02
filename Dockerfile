FROM docker.adeo.no:5000/bekkci/maven-builder
ADD / /source
ENV NODE_ENV=production
RUN build

# TODO oppsett for nais