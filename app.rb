require 'bundler'
Bundler.require
include BCrypt

DB = Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://db/main.db')
require './models.rb'

use Rack::Session::Cookie, :key => 'rack.session',
    :expire_after => 2592000,
    :secret => SecureRandom.hex(64)



get '/' do
  erb :index
end
get '/dashboard' do
  if session[:visited]
    @user = User.first(:id => session[:id])
    erb :dashboard
  else
    redirect '/'
  end
end

###########POSTS##############

post '/user/create' do
  u = User.new
  u.firstname = params[:firstname]
  u.lastname = params[:lastname]
  #u.email = params[:email]
  u.password = Password.create("Maker20")
  u.perm = 1
  u.save
end

post '/user/create' do
  u = User.new
  u.firstname = params[:firstname]
  u.lastname = params[:lastname]
  u.email = params[:email]
  u.password = Password.create("Maker20")
  u.perm = 1
  u.save

  @u = User.first(:email => params[:email])

  if @u && Password.new(@u.password) == params[:password]
    session[:id] = @u.id
    session[:visited] = true
    redirect '/dashboard'
  else

    redirect '/'
  end

end