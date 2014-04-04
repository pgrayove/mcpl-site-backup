#
# Apache/PHP/Drupal settings:
#

# Protect files and directories from prying eyes.
<FilesMatch "\.(engine|inc|info|install|make|module|profile|test|po|sh|.*sql|theme|tpl(\.php)?|xtmpl|svn-base)$|^(code-style\.pl|Entries.*|Repository|Root|Tag|Template|all-wcprops|entries|format)$">
  Order allow,deny
</FilesMatch>

# Don't show directory listings for URLs which map to a directory.
Options -Indexes

# Follow symbolic links in this directory.
Options +FollowSymLinks

# Make Drupal handle any 404 errors.
ErrorDocument 404 /index.php

# Force simple error message for requests for non-existent favicon.ico.
<Files favicon.ico>
  # There is no end quote below, for compatibility with Apache 1.3.
  ErrorDocument 404 "The requested file favicon.ico was not found.
</Files>

# Set the default handler.
DirectoryIndex index.php

# Override PHP settings. More in sites/default/settings.php
# but the following cannot be changed at runtime.

# PHP 4, Apache 1.
<IfModule mod_php4.c>
  php_value magic_quotes_gpc                0
  php_value register_globals                0
  php_value session.auto_start              0
  php_value mbstring.http_input             pass
  php_value mbstring.http_output            pass
  php_value mbstring.encoding_translation   0
</IfModule>

# PHP 4, Apache 2.
<IfModule sapi_apache2.c>
  php_value magic_quotes_gpc                0
  php_value register_globals                0
  php_value session.auto_start              0
  php_value mbstring.http_input             pass
  php_value mbstring.http_output            pass
  php_value mbstring.encoding_translation   0
</IfModule>

# PHP 5, Apache 1 and 2.
<IfModule mod_php5.c>
  php_value magic_quotes_gpc                0
  php_value register_globals                0
  php_value session.auto_start              0
  php_value mbstring.http_input             pass
  php_value mbstring.http_output            pass
  php_value mbstring.encoding_translation   0
</IfModule>

# Requires mod_expires to be enabled.
<IfModule mod_expires.c>
  # Enable expirations.
  ExpiresActive On

  # Cache all files for 2 weeks after access (A).
  ExpiresDefault A1209600

  <FilesMatch \.php$>
    # Do not allow PHP scripts to be cached unless they explicitly send cache
    # headers themselves. Otherwise all scripts would have to overwrite the
    # headers set by mod_expires if they want another caching behavior. This may
    # fail if an error occurs early in the bootstrap process, and it may cause
    # problems if a non-Drupal PHP file is installed in a subdirectory.
    ExpiresActive Off
  </FilesMatch>
</IfModule>

# Various rewrite rules.
<IfModule mod_rewrite.c>
  RewriteEngine on

  # If your site can be accessed both with and without the 'www.' prefix, you
  # can use one of the following settings to redirect users to your preferred
  # URL, either WITH or WITHOUT the 'www.' prefix. Choose ONLY one option:
  #
  # To redirect all users to access the site WITH the 'www.' prefix,
  # (http://example.com/... will be redirected to http://www.example.com/...)
  # adapt and uncomment the following:
  # RewriteCond %{HTTP_HOST} ^example\.com$ [NC]
  # RewriteRule ^(.*)$ http://www.example.com/$1 [L,R=301]
  #
  # To redirect all users to access the site WITHOUT the 'www.' prefix,
  # (http://www.example.com/... will be redirected to http://example.com/...)
  # uncomment and adapt the following:
  # RewriteCond %{HTTP_HOST} ^www\.example\.com$ [NC]
  # RewriteRule ^(.*)$ http://example.com/$1 [L,R=301]

  # Modify the RewriteBase if you are using Drupal in a subdirectory or in a
  # VirtualDocumentRoot and the rewrite rules are not working properly.
  # For example if your site is at http://example.com/drupal uncomment and
  # modify the following line:
  # RewriteBase /drupal
  #
  # If your site is running in a VirtualDocumentRoot at http://example.com/,
  # uncomment the following line:
  # RewriteBase /

# To redirect all users to mcpl.info/bookblog from
  # bookblogblog.mcpl.info
  RewriteCond %{HTTP_HOST} ^bookblog.mcpl.info$ [OR]
  RewriteCond %{HTTP_HOST} ^www.bookblog.mcpl.info$
  RewriteRule ^.*$ "http://mcpl.info\/bookblog" [R=301,L]

# To redirect all users to mcpl.info/moviemusicblog from
  # moviemusicblog.mcpl.info
  RewriteCond %{HTTP_HOST} ^moviemusicblog.mcpl.info$ [OR]
  RewriteCond %{HTTP_HOST} ^www.moviemusicblog.mcpl.info$
  RewriteRule ^.*$ "http://mcpl.info\/moviemusicblog" [R=301,L]

# To redirect all users to mcpl.info/childrensblog from
  # childrensblog.mcpl.info
  RewriteCond %{HTTP_HOST} ^childrensblog.mcpl.info$ [OR]
  RewriteCond %{HTTP_HOST} ^www.childrensblog.mcpl.info$
  RewriteRule ^.*$ "http://mcpl.info\/childrensblog" [R=301,L]

# To redirect all users to mcpl.info/geninfo/monroe-county-timeline from
  # timeline.mcpl.info
  RewriteCond %{HTTP_HOST} ^timeline.mcpl.info$ [OR]
  RewriteCond %{HTTP_HOST} ^timeline.monroe.lib.in.us/$
  RewriteRule ^.*$ "http://mcpl.info\/geninfo\/monroe-county-timeline" [R=301,L]

# To redirect all users to mcpl.info/money/its-your-money from
  # timeline.mcpl.info
  RewriteCond %{HTTP_HOST} ^money.mcpl.info$ [OR]
  RewriteCond %{HTTP_HOST} ^money.monroe.lib.in.us/$
  RewriteRule ^.*$ "http://mcpl.info\/money/its-your-money" [R=301,L]

# To redirect all users to mcpl.info/indiana/indiana-bedrock from
  # timeline.mcpl.info
  RewriteCond %{HTTP_HOST} ^indianabedrock.org$ [OR]
  RewriteCond %{HTTP_HOST} ^www.indianabedrock.org/$
  RewriteRule ^.*$ "http://mcpl.info\/indiana/indiana-bedrock" [R=301,L]


# To redirect calendar pages
  RedirectPermanent /page/teens-calendar http://mcpl.info/calendar?term_node_tid_depth[]=11&term_node_tid_depth[]=4
  RedirectPermanent /page/adults-calendar http://mcpl.info/calendar?term_node_tid_depth[]=7&term_node_tid_depth[]=3
  RedirectPermanent /page/technology-calendar http://mcpl.info/calendar?term_node_tid_depth[]=10&term_node_tid_depth[]=970


  # Rewrite URLs of the form 'x' to the form 'index.php?q=x'.
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !=/favicon.ico
  RewriteRule ^(.*)$ index.php?q=$1 [L,QSA]
</IfModule>

# $Id$