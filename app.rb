$:.unshift(File.expand_path(File.join(File.dirname(__FILE__),"lib")))
require 'sinatra'
require 'sinatra/jsonp'
require '23hq'

mime_type :ttf, 'font/ttf'
mime_type :eot, 'application/vnd.ms-fontobject'
mime_type :otf, 'application/octet-stream'

get '/' do
  @photos = TwentyThreeHQ.photos.shuffle
  haml :home
end

get '/photos' do
  content_type :json
  jsonp TwentyThreeHQ.photos.shuffle
end