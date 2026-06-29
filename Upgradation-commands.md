# Migration of SERC website from OLD server to NEW server (25-06-2026)

## Inventory of OLD server

```zsh
$ systemctl list-units --type=service --state=running
    UNIT                     LOAD   ACTIVE SUB     DESCRIPTION
    console-getty.service    loaded active running Console Getty
    crond.service            loaded active running Command Scheduler
    dbus.service             loaded active running D-Bus System Message Bus
    getty@tty2.service       loaded active running Getty on tty2
    httpd.service            loaded active running The Apache HTTP Server
    network.service          loaded active running LSB: Bring up/down networking
    nrpe.service             loaded active running Nagios Remote Program Executor
    rsyslog.service          loaded active running System Logging Service
    saslauthd.service        loaded active running SASL authentication daemon.
    sendmail.service         loaded active running Sendmail Mail Transport Agent
    sm-client.service        loaded active running Sendmail Mail Transport Client
    sshd.service             loaded active running OpenSSH server daemon
    systemd-journald.service loaded active running Journal Service
    systemd-logind.service   loaded active running Login Service
    systemd-udevd.service    loaded active running udev Kernel Device Manager
    xinetd.service           loaded active running Xinetd A Powerful Replacement For Inetd

    LOAD   = Reflects whether the unit definition was properly loaded.
    ACTIVE = The high-level unit activation state, i.e. generalization of SUB.
    SUB    = The low-level unit activation state, values depend on unit type.

    16 loaded units listed. Pass --all to see loaded but inactive units, too.
    To show all installed unit files use 'systemctl list-unit-files'.

$ httpd -V
    AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using serc.iiit.ac.in. Set the 'ServerName' directive globally to suppress this message

    Server version: Apache/2.4.6 (CentOS)
    Server built:   Nov 10 2021 14:26:31
    Server's Module Magic Number: 20120211:24
    Server loaded:  APR 1.4.8, APR-UTIL 1.5.2
    Compiled using: APR 1.4.8, APR-UTIL 1.5.2
    Architecture:   64-bit
    Server MPM:     prefork
    threaded:     no
        forked:     yes (variable process count)
    Server compiled with....
    -D APR_HAS_SENDFILE
    -D APR_HAS_MMAP
    -D APR_HAVE_IPV6 (IPv4-mapped addresses enabled)
    -D APR_USE_SYSVSEM_SERIALIZE
    -D APR_USE_PTHREAD_SERIALIZE
    -D SINGLE_LISTEN_UNSERIALIZED_ACCEPT
    -D APR_HAS_OTHER_CHILD
    -D AP_HAVE_RELIABLE_PIPED_LOGS
    -D DYNAMIC_MODULE_LIMIT=256
    -D HTTPD_ROOT="/etc/httpd"
    -D SUEXEC_BIN="/usr/sbin/suexec"
    -D DEFAULT_PIDLOG="/run/httpd/httpd.pid"
    -D DEFAULT_SCOREBOARD="logs/apache_runtime_status"
    -D DEFAULT_ERRORLOG="logs/error_log"
    -D AP_TYPES_CONFIG_FILE="conf/mime.types"
    -D SERVER_CONFIG_FILE="conf/httpd.conf"
$ httpd -S
    AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using serc.iiit.ac.in. Set the 'ServerName' directive globally to suppress this message
    VirtualHost configuration:
    *:443                  serc.iiit.ac.in (/etc/httpd/conf.d/ssl.conf:56)
    *:80                   serc.iiit.ac.in (/etc/httpd/conf/httpd.conf:355)
    ServerRoot: "/etc/httpd"
    Main DocumentRoot: "/var/www/html"
    Main ErrorLog: "/etc/httpd/logs/error_log"
    Mutex proxy-balancer-shm: using_defaults
    Mutex rewrite-map: using_defaults
    Mutex authdigest-client: using_defaults
    Mutex ssl-stapling: using_defaults
    Mutex proxy: using_defaults
    Mutex authn-socache: using_defaults
    Mutex ssl-cache: using_defaults
    Mutex default: dir="/run/httpd/" mechanism=default 
    Mutex mpm-accept: using_defaults
    Mutex authdigest-opaque: using_defaults
    PidFile: "/run/httpd/httpd.pid"
    Define: _RH_HAS_HTTPPROTOCOLOPTIONS
    Define: DUMP_VHOSTS
    Define: DUMP_RUN_CFG
    User: name="apache" id=48
    Group: name="apache" id=48
$ find /etc/httpd -type f | sort
    /etc/httpd/conf.d/autoindex.conf
    /etc/httpd/conf.d/mpm_prefork.conf
    /etc/httpd/conf.d/README
    /etc/httpd/conf.d/ssl.conf
    /etc/httpd/conf.d/userdir.conf
    /etc/httpd/conf.d/welcome.conf
    /etc/httpd/conf/httpd.conf
    /etc/httpd/conf/magic
    /etc/httpd/conf.modules.d/00-base.conf
    /etc/httpd/conf.modules.d/00-dav.conf
    /etc/httpd/conf.modules.d/00-lua.conf
    /etc/httpd/conf.modules.d/00-mpm.conf
    /etc/httpd/conf.modules.d/00-proxy.conf
    /etc/httpd/conf.modules.d/00-ssl.conf
    /etc/httpd/conf.modules.d/00-systemd.conf
    /etc/httpd/conf.modules.d/01-cgi.conf
$ grep -R "DocumentRoot" /etc/httpd
    Binary file /etc/httpd/modules/mod_vhost_alias.so matches
    /etc/httpd/conf.d/ssl.conf:DocumentRoot "/var/www/html"
    /etc/httpd/conf/httpd.conf:# DocumentRoot: The directory out of which you will serve your
    /etc/httpd/conf/httpd.conf:DocumentRoot "/var/www/html"
    /etc/httpd/conf/httpd.conf:    # access content that does not live under the DocumentRoot.
    /etc/httpd/conf/httpd.conf:        #DocumentRoot /var/www/html
$ grep -R "SSLCertificateFile" /etc/httpd
    Binary file /etc/httpd/modules/mod_ssl.so matches
    /etc/httpd/conf.d/ssl.conf:# Point SSLCertificateFile at a PEM encoded certificate.  If
    /etc/httpd/conf.d/ssl.conf:#SSLCertificateFile /etc/pki/tls/certs/localhost.crt
    /etc/httpd/conf.d/ssl.conf:SSLCertificateFile /etc/pki/tls/certs/iiit.ac.in.crt
    /etc/httpd/conf.d/ssl.conf:#   the referenced file can be the same as SSLCertificateFile
$ grep -R "SSLCertificateKeyFile" /etc/httpd
    Binary file /etc/httpd/modules/mod_ssl.so matches
    /etc/httpd/conf.d/ssl.conf:#SSLCertificateKeyFile /etc/pki/tls/private/localhost.key
    /etc/httpd/conf.d/ssl.conf:SSLCertificateKeyFile /etc/pki/tls/private/iiit.ac.in.key
$ grep -R "SSLCertificateChainFile" /etc/httpd
    Binary file /etc/httpd/modules/mod_ssl.so matches
    /etc/httpd/conf.d/ssl.conf:#   Point SSLCertificateChainFile at a file containing the
    /etc/httpd/conf.d/ssl.conf:#SSLCertificateChainFile /etc/pki/tls/certs/server-chain.crt

$ sudo tar czf migration.tar.gz \
    /var/www/html \
    /etc/pki/tls/certs/iiit.ac.in.crt \
    /etc/pki/tls/private/iiit.ac.in.key \
    /etc/httpd/conf.d/ssl.conf

$ cd /var/www/
$ tar czf serc-site-migration-backup-$(date +%F).tar.gz \
>     cgi-bin \
>     git-repo \
>     html \
>     newserc-v1.back \
>     out \
>     public \
>     site_backup_1sep2024 \
>     site-backups \
>     ssl.conf \
>     test.txt
```


Local backup
```
scp root@serc.iiit.ac.in:/var/www/serc-site-migration-backup-2026-06-25.tar.gz ./
```














```bash
# Update system
apt update
apt upgrade -y

# Install nginx
apt install git nginx vim curl -y

# Enable and start
systemctl enable nginx
systemctl start nginx

# Verify
systemctl status nginx

# check things
systemctl list-units --type=service --state=running
systemctl list-units --type=service --state=enabled


# setup
mkdir -p /var/www/serc.iiit.ac.in
```

# Copy files to the server
```
rm -rf out/
bun run build
rsync -avz out/ root@serc-dev.iiit.ac.in:/var/www/serc.iiit.ac.in/
```


# ON the server
```
# verify the files are copied
ls /var/www/serc.iiit.ac.in/

# create nginx config file
vim /etc/nginx/sites-available/serc.iiit.ac.in.conf
```

Add

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name serc.iiit.ac.in;

    root /var/www/serc.iiit.ac.in;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
    error_page 404 /404/index.html;
}
```

```bash
#enable the site
ln -s /etc/nginx/sites-available/serc.iiit.ac.in.conf \
      /etc/nginx/sites-enabled/

nginx -t
systemctl reload nginx
## certs
mkdir -p /etc/nginx/ssl
```

## On local
```bash
scp ./etc/pki/tls/certs/iiit.ac.in.crt ./etc/pki/tls/private/iiit.ac.in.key root@serc-dev.iiit.ac.in:/etc/nginx/ssl/
```

```bash
chmod 600 /etc/nginx/ssl/iiit.ac.in.key
chown root:root /etc/nginx/ssl/iiit.ac.in.key
```

# update nginx
```
# Redirect HTTP -> HTTPS
server {
    listen 80;
    listen [::]:80;

    server_name serc.iiit.ac.in;

    return 301 https://$host$request_uri;
}

# Main HTTPS site
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name serc.iiit.ac.in;

    root /var/www/serc.iiit.ac.in;
    index index.html;

    ssl_certificate     /etc/nginx/ssl/iiit.ac.in.crt;
    ssl_certificate_key /etc/nginx/ssl/iiit.ac.in.key;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;

    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        application/rss+xml
        image/svg+xml;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(css|js|jpg|jpeg|png|gif|svg|ico|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    error_page 404 /404/index.html;
}
```

```shell
nginx -t
systemctl restart nginx
systemctl enable nginx
```





```
unlink /etc/nginx/sites-enabled/default
```





```bash
# Verification
$ openssl x509 -in iiit.ac.in.crt -noout -dates
    notBefore=Sep 30 08:51:06 2025 GMT
    notAfter=Nov 1 08:51:05 2026 GMT
$ openssl x509 -in iiit.ac.in.crt -noout -issuer
    issuer=C=BE, O=GlobalSign nv-sa, CN=GlobalSign GCC R6 AlphaSSL CA 2025
$ ss -tlnp | grep nginx
    LISTEN 0      511          0.0.0.0:80        0.0.0.0:*    users:(("nginx",pid=7518,fd=5),("nginx",pid=7516,fd=5))
    LISTEN 0      511          0.0.0.0:443       0.0.0.0:*    users:(("nginx",pid=7518,fd=7),("nginx",pid=7516,fd=7))
    LISTEN 0      511             [::]:80           [::]:*    users:(("nginx",pid=7518,fd=6),("nginx",pid=7516,fd=6))
    LISTEN 0      511             [::]:443          [::]:*    users:(("nginx",pid=7518,fd=8),("nginx",pid=7516,fd=8))

$ curl -I http://localhost
    HTTP/1.1 200 OK
    Server: nginx/1.24.0 (Ubuntu)
    Date: Wed, 24 Jun 2026 23:55:18 GMT
    Content-Type: text/html
    Content-Length: 615
    Last-Modified: Wed, 24 Jun 2026 22:27:20 GMT
    Connection: keep-alive
    ETag: "6a3c59c8-267"
    Accept-Ranges: bytes
$ curl -Ik https://localhost
    HTTP/2 200 
    server: nginx/1.24.0 (Ubuntu)
    date: Wed, 24 Jun 2026 23:55:51 GMT
    content-type: text/html
    content-length: 58529
    last-modified: Wed, 24 Jun 2026 22:38:20 GMT
    vary: Accept-Encoding
    etag: "6a3c5c5c-e4a1"
    strict-transport-security: max-age=31536000
    x-content-type-options: nosniff
    x-frame-options: SAMEORIGIN
    referrer-policy: strict-origin-when-cross-origin
    accept-ranges: bytes
$ ufw status
    Status: inactive
```

## Use a dedicated deploy user

```bash
# create group for deployments
groupadd deploy

# create user without a home directory
useradd \
    --system \
    --gid deploy \
    --shell /bin/bash \
    --no-create-home \
    deploy

# set password
passwd deploy
```

```
chown -R root:deploy /var/www/serc.iiit.ac.in

find /var/www/serc.iiit.ac.in -type d -exec chmod 775 {} \;
find /var/www/serc.iiit.ac.in -type f -exec chmod 664 {} \;
```

```bash
visudo -f /etc/sudoers.d/deploy
```

```txt
deploy ALL=(root) NOPASSWD: /usr/sbin/nginx -t
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl reload nginx
```

```
chown root:root /etc/sudoers.d/deploy
chmod 0440 /etc/sudoers.d/deploy

# check the syntax of the sudoers file
visudo -c
```


# tried it out with
```sh
su - deploy

sudo nginx -t
sudo systemctl reload nginx


sudo -l
    Matching Defaults entries for deploy on serc-dev:
        env_reset, mail_badpass,
        secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

    User deploy may run the following commands on serc-dev:
        (root) NOPASSWD: /usr/sbin/nginx -t
        (root) NOPASSWD: /usr/bin/systemctl reload nginx
getent passwd deploy
    deploy:x:999:1000::/home/deploy:/bin/bash
```

