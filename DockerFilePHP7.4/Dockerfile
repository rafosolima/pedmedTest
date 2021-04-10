FROM ubuntu:18.04

WORKDIR /var/www/html

RUN apt-get update -y --fix-missing

RUN apt-get install -y software-properties-common \
                    build-essential \
                    curl \
                    vim \
                    zip \
                    mcrypt \
                    apt-utils \
                    git \
                    libnss3-tools

ENV TIMEZONE="America/Maceio"

RUN DEBIAN_FRONTEND="noninteractive" apt-get -y install tzdata

RUN ln -snf /usr/share/zoneinfo/${TIMEZONE} /etc/localtime && echo ${TIMEZONE} > /etc/timezone
RUN dpkg-reconfigure --frontend noninteractive tzdata

RUN apt-get update -y --fix-missing

RUN apt-get update \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/9/prod.list \
        > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get install -y --no-install-recommends \
        locales \
        apt-transport-https \
    && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen \
    && locale-gen \
    && apt-get update \
    && ACCEPT_EULA="y" apt-get -y --no-install-recommends install \
        unixodbc-dev \
        msodbcsql17

RUN apt-get install -y apache2

RUN a2enmod rewrite
RUN a2enmod ssl
RUN a2ensite default-ssl
RUN a2dismod mpm_event
RUN a2enmod mpm_prefork

RUN service apache2 restart

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/ssl-cert-snakeoil.key -out /etc/ssl/certs/ssl-cert-snakeoil.pem -subj "/C=AT/ST=Vienna/L=Vienna/O=Security/OU=Development/CN=example.com"

RUN LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php

RUN apt-get update -y

RUN apt-get install -y php7.4 \
                        php7.4-common \
                        php7.4-intl \
                        php7.4-mysql \
                        php7.4-bcmath \
                        php7.4-curl \
                        php7.4-gd \
                        php7.4-json \
                        php7.4-readline \
                        php7.4-zip \
                        php7.4-bz2 \
                        php7.4-dev \
                        php7.4-imap \
                        php7.4-xdebug \
                        php7.4-mbstring \
                        php7.4-xml \
                        php7.4-soap

RUN update-alternatives --set php /usr/bin/php7.4
RUN update-alternatives --set phar /usr/bin/phar7.4
RUN update-alternatives --set phar.phar /usr/bin/phar.phar7.4
RUN update-alternatives --set phpize /usr/bin/phpize7.4
RUN update-alternatives --set php-config /usr/bin/php-config7.4

RUN pecl install sqlsrv pdo_sqlsrv

RUN printf "; priority=20\nextension=sqlsrv.so\n" > /etc/php/7.4/mods-available/sqlsrv.ini
RUN printf "; priority=30\nextension=pdo_sqlsrv.so\n" > /etc/php/7.4/mods-available/pdo_sqlsrv.ini

RUN phpenmod -v 7.4 sqlsrv pdo_sqlsrv

RUN a2enmod php7.4

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ENV PHP_SHORT_OPEN_TAG="On"
ENV PHP_SERIALIZE_PRECISION="100"
ENV PHP_POST_MAX_SIZE="256M"
ENV PHP_UPLOAD_MAX_FILESIZE="20M"
ENV PHP_MEMORY_LIMIT="256M"
ENV PHP_REGISTER_GLOBALS="On"
ENV PHP_MAX_INPUT="1000"
ENV PHP_ERROR_REPORTING="E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING"
ENV VIRTUAL_HOST_DOCUMENT_ROOT="/var/www/html"

# apache.config
RUN sed -i 's/AllowOverride None\s*/AllowOverride ALL/g' /etc/apache2/apache2.conf

# php.ini
RUN sed -i 's/^serialize_precision\s*=\s*17/serialize_precision = {PHP_SERIALIZE_PRECISION}/g' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/^short_open_tag\s*=\s*Off/short_open_tag = ${PHP_SHORT_OPEN_TAG}/g' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/^post_max_size\s*=\s*8M/post_max_size = ${PHP_POST_MAX_SIZE}/g' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/^memory_limit\s*=\s*128M/memory_limit = ${PHP_MEMORY_LIMIT}/g' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/^register_globals\s*=\s*Off/register_globals = ${PHP_REGISTER_GLOBALS}/g' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/^;session.save_path\s*=\s*"\/tmp\"/session.save_path = "\/tmp\"/g' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/^display_startup_errors\s*=\s*Off/display_startup_errors = On/g' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/^session.gc_probability\s*=\s*0/session.gc_probability = 1/g' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/^session.bug_compat_42\s*=\s*Off/session.bug_compat_42 = On/g' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/^session.bug_compat_warn\s*=\s*Off/session.bug_compat_warn = On/g' /etc/php/7.4/apache2/php.ini
RUN sed -i '/error_reporting = E_ALL & ~E_DEPRECATED/c\error_reporting = ${PHP_ERROR_REPORTING}' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/^display_errors\s*=\s*Off/display_errors = On/g' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/^track_errors\s*=\s*Off/track_errors = On/g' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/^html_errors\s*=\s*Off/html_errors = On/g' /etc/php/7.4/apache2/php.ini
RUN sed -i "/;error_log = php_errors.log/c\error_log = '\/var\/www\/logs\/php_error_log'" /etc/php/7.4/apache2/php.ini
RUN sed -i 's/; max_input_vars =\s*1000/max_input_vars =${PHP_MAX_INPUT}/g' /etc/php/7.4/apache2/php.ini
RUN sed -i 's/;date.timezone =/date.timezone=${TIMEZONE}/g' /etc/php/7.4/apache2/php.ini

RUN sed -i 's/DocumentRoot\s\/var\/www\/html/DocumentRoot ${VIRTUAL_HOST_DOCUMENT_ROOT}/g' /etc/apache2/sites-available/000-default.conf

RUN echo "xdebug.mode = develop, coverage, debug" >> /etc/php/7.4/apache2/conf.d/xdebug.ini \
    && echo "xdebug.start_with_request = 1" >> /etc/php/7.4/apache2/conf.d/xdebug.ini \
    && echo "xdebug.discover_client_host = 1" >> /etc/php/7.4/apache2/conf.d/xdebug.ini \
    && echo "xdebug.var_display_max_depth = -1" >> /etc/php/7.4/apache2/conf.d/xdebug.ini \
    && echo "xdebug.var_display_max_children = -1" >> /etc/php/7.4/apache2/conf.d/xdebug.ini \
    && echo "xdebug.var_display_max_data = -1" >> /etc/php/7.4/apache2/conf.d/xdebug.ini

RUN usermod -o -u 1000 www-data

EXPOSE 80 443

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]