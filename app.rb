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
get '/signin' do
    erb :signin
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
post '/sign/:id' do
  user = User.first(:id => session[:id])
  Pony.mail(
      :to => 'nqmetke@gmail.com',
      :from => 'betamakerspace@gmail.com',
      :subject=> "New Training Request from #{params[:firstname]} #{params[:lastname]}",
      :body => "This person would like to train on #{params[:date]} at #{params[:time]}. If you wish to contact #{params[:firstname]}, his/her email is #{params[:email]}",
      :via => :smtp,
      :via_options =>{
          :address              => 'smtp.gmail.com',
          :port                 => '587',
          :enable_starttls_auto => true,
          :user_name            => 'betamakerspace',
          :password             => 'wplmakerspace',
          :authentication       => :plain,
          :domain               => 'localhost.localdomain'


      }  )
  puts "Hey!"
end